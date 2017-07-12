const fs = require('fs');
const dot = require('dot');

const models = require('../db/models');
const translations = require('./translations');

async function replaceInTemplate(language, data, concierge, reference) {
  const template = fs.readFileSync(`${__dirname}/../templates/pdf.html`, 'utf8');
  // const template = fs.readFileSync(`${__dirname}/../templates/pdftext.html`, 'utf8');
  const templateFunc = dot.template(template);

  const itemData = await processData(data, concierge, reference);

  itemData.dict = translations[language];

  return templateFunc(itemData);
}

async function processData(data,concierge, reference) {
  const rooms = await getRooms();
  const totalData = {
    amount: 0,
    weight: 0,
    volume: 0
  };

  let id;
  for(let item of data) {
    const roomId = item.room_type;

    if (!roomId || !rooms.hasOwnProperty(roomId)) {
      continue;
    }

    item.detail = [item.width, item.depth, item.length]
    // .filter(property => property !== void 0) // void 0 === undefined
      .map(property => Number(property))
      .join('cm x ');
    item.description = item.description || '-';
    item.weight = Number(item.weight);

    // console.log("item.dismantling_factor ",item.dismantling_factor );
    // console.log("item.amount",item.amount );
    // console.log("item.width ",item.width);
    // console.log("item.length ",item.length );
    // console.log("item.depth ",item.depth );
    item.volume = Math.round(item.dismantling_factor *  item.width * item.length * item.depth / 10000) / 100 || 0;
    // console.log("item.volume ",item.volume );
    if(item.requires_packaging === 1){
      //crated items occupy 20% more volume!
      item.volume = (item.volume*1.2).toFixed(2);
    }


    item.total_weight = (item.weight * item.amount).toFixed(2);
    item.total_volume = (item.volume * item.amount).toFixed(2);


    totalData.amount += item.amount;
    totalData.weight += Number(item.total_weight);

    totalData.volume = (Number(totalData.volume )+ Number(item.total_volume)).toFixed(2);
    totalData.volume_gross = (totalData.volume * 1.2).toFixed(2);
    // console.log("total_volume",item.total_volume,'totalData.total_volume ',totalData.volume );
    id = item.api_id;
    rooms[roomId].items.push(item);
  }


  // const concierge = await models.conciergeItems.findOne({
  //   where: {
  //     api_id: id
  //   }
  // });

  const roomData = Object.keys(rooms).map(key => rooms[key]).filter(roomData => roomData.items.length > 0);

  return {
    assetPath: `file://${__dirname}`,
    total: totalData,
    rooms: roomData,
    concierge: concierge,
    reference_number: reference ? reference: id,
    date: `${new Date().getDate()}.${new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1).toString() : new Date().getMonth() + 1}.${new Date().getFullYear()}`
  };
}

async function getRooms() {
  const rooms = await models.roomType.findAll();
  const results = {};

  for(let room of rooms) {
    results[room.id] = {
      name: room.name,
      items: []
    }
  }
  return results;
}

module.exports = replaceInTemplate;
