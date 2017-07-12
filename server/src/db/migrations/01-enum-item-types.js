'use strict';

const ItemType = require('../models/item_type');

const data =  [
  { id: 1, name: { en: 'Furniture', de: '' } },
  { id: 2, name: { en: 'Packaging', de: '' } },
  { id: 3, name: { en: 'Special item', de: '' }}
];

module.exports = {
  up: function (queryInterface) {
    return queryInterface.sequelize.transaction(function (t) {
      return Promise.all(data.map(typeData => {
        return ItemType.create(typeData, { transaction: t })
      }));
    });
  },

  down: function () {
    return ItemType.destroy({ truncate: true });
  }
};
