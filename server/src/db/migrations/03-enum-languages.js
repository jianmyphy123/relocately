'use strict';

const Language = require('../models/language');

const data =  [
  { code: 'en', text: 'English' },
  { code: 'de', text: 'Deutsch' }
];

module.exports = {
  up: function(queryInterface) {
    return queryInterface.sequelize.transaction(function(t) {
      return Promise.all(data.map(typeData => {
        return Language.create(typeData, {transaction: t})
      }));
    });
  },

  down: function() {
    return Language.destroy({truncate: true});
  }
};
