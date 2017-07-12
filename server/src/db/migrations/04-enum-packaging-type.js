'use strict';

const PackagingType = require('../models/packaging_type');

const data = [
  { id: 1, name: { en: 'Yes', de: 'Ja' } },
  { id: 2, name: { en: 'No', de: 'Nein' } },
  { id: 3, name: { en: 'Yes - crate', de: 'Ja - Crate' } }
];

module.exports = {
  up: function(queryInterface) {
    return queryInterface.sequelize.transaction(function(t) {
      return Promise.all(data.map(typeData => {
        return PackagingType.create(typeData, {transaction: t})
      }));
    });
  },

  down: function() {
    return PackagingType.destroy({truncate: true});
  }
};
