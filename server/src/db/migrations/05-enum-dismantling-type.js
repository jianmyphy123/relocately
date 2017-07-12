'use strict';

const DismantlingType = require('../models/dismantling_type');

const data =  [
  { id: 1, name: { en: 'NO', de: '' } },
  { id: 2, name: { en: 'Yes - by Relocately', de: '' } },
  { id: 3, name: { en: 'Yes - by Customer', de: '' } }
];

module.exports = {
  up: function(queryInterface) {
    return queryInterface.sequelize.transaction(function(t) {
      return Promise.all(data.map(typeData => {
        return DismantlingType.create(typeData, {transaction: t})
      }));
    });
  },

  down: function() {
    return DismantlingType.destroy({truncate: true});
  }
};
