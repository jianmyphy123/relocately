'use strict';

const RoomType = require('../models/room_type');

const data =  [
  { id: 1, name: { en: 'Attic', de: 'Dachboden' } },
  { id: 2, name: { en: 'Bathroom', de: 'Badezimmer' } },
  { id: 3, name: { en: 'Bathroom #2', de: 'Badezimmer #2' } },
  { id: 4, name: { en: 'Bathroom #3', de: 'Badezimmer #3' } },
  { id: 5, name: { en: 'Bedroom', de: 'Schlafzimmer' } },
  { id: 6, name: { en: 'Bedroom #2', de: 'Schlafzimmer #2' } },
  { id: 7, name: { en: 'Bedroom #3', de: 'Schlafzimmer #3' } },
  { id: 8, name: { en: 'Basement', de: 'Keller, Untergeschoss' } },
  { id: 9, name: { en: 'Child\'s room', de: 'Kinderzimmer' } },
  { id: 10, name: { en: 'Corridor', de: 'Flur' } },
  { id: 11, name: { en: 'Dining room', de: 'Esszimmer' } },
  { id: 12, name: { en: 'Garage', de: 'Garage' } },
  { id: 13, name: { en: 'Kitchen', de: 'Küche' } },
  { id: 14, name: { en: 'Living room', de: 'Wohnzimmer' } },
  { id: 15, name: { en: 'Office', de: 'Büro' } },
  { id: 16, name: { en: 'Study', de: 'Arbeitszimmer' } },
  { id: 17, name: { en: 'Balcony', de: 'Balkon' } },
  { id: 18, name: { en: 'Storage room', de: 'Abstellraum, Lagerraum' } },
  { id: 19, name: { en: 'Walk-in closet', de: 'Begehbarer Schrank, Begehbarer Kleiderschrank' } },
  { id: 20, name: { en: 'Laundry room', de: 'Waschküche, Hauswirtschaftsraum' } },
  { id: 21, name: { en: 'Terrace', de: 'Terrasse' } },
];

module.exports = {
  up: function(queryInterface) {
    return queryInterface.sequelize.transaction(function(t) {
      return Promise.all(data.map(typeData => {
        return RoomType.create(typeData, {transaction: t})
      }));
    });
  },

  down: function() {
    return RoomType.destroy({truncate: true});
  }
};
