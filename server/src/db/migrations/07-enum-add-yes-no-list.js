'use strict';

const YesNo = require('../models/yes_no');

const data =  [
  { id: 1, name: {en: 'Yes', de: 'Ja' } },
  { id: 2, name: {en: 'No', de: 'Nein' } }
];

module.exports = {
  up: function(queryInterface) {
    return queryInterface.sequelize.transaction(function(t) {
      return Promise.all(data.map(typeData => {
        return YesNo.create(typeData, {transaction: t})
      }));
    });
  },

  down: function() {
    return YesNo.destroy({truncate: true});
  }
};
