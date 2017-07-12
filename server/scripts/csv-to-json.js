require('babel-core/register');
require('csv-parse/lib/sync');

const fs = require('fs');
const parse = require('csv').parse;

const columnDefinition = [
  'type',
  'category',
  'name_de',
  'name_en',
  'length',
  'width',
  'depth',
  'dismantling_factor',
  'duration_dismantling',
  'duration_assembly',
  'surface',
  'volume_assembled',
  'volume_dismantled',
  'bubble_wrap_factor',
  'bubble_wrap_width',
  'mattress_covers',
  'crating_possible',
  'amount',
  'customer_volume',
  'duration_dismantling_customer',
  'duration_assembly_customer'
];
const typeMap = {
  'Furniture': 1,
  'Packmaterial' : 2,
  'Special Item': 3,
  'Car': 4
};


const parser = parse({ delimiter: ',', columns: columnDefinition });

let rowNo = 0;
const dataRows = [];

parser.on('data', function(row) {
  rowNo++;
  if (rowNo <= 2) {// getting rid of the header rows
    return true;
  }

  if (row.type === "" && row.name_en === "" && row.name_de === "") {
    return true;
  }

  row.name = {
    en: row.name_en || row.name_de,
    de: row.name_de || row.name_en
  };
  delete row.name_de;
  delete row.name_en;

  row.type = typeMap[row.type] || null;
  row.dismantling_factor = parseFloat(row.dismantling_factor) / 100;

  row.amount = row.amount || null;

  row.width = row.width.replace(",", ".") || null;
  row.length = row.length.replace(",", ".") || null;
  row.depth = row.depth.replace(",", ".") || null;
  row.surface = row.surface.replace(",", ".");
  row.bubble_wrap_width = row.bubble_wrap_width.replace(",", ".");
  row.volume_assembled = row.volume_assembled.replace(",", ".");
  row.volume_dismantled = row.volume_dismantled.replace(",", ".");

  dataRows.push(row);
});

parser.on('finish', function() {
  fs.writeFileSync(`${__dirname}/../src/db/migrations/6-csv-import.json`, JSON.stringify(dataRows));
});

fs.createReadStream(__dirname+'/inventory.csv').pipe(parser);
