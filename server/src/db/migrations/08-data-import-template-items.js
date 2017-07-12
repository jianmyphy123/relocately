'use strict';

const TemplateItem = require('../models/template_items');

var data = require('./release_data.json');
const processJson = require('./processjson.js');

module.exports = {

  up: function(queryInterface) {
    data = processJson.process(data);
    //clear old data
    TemplateItem.destroy({truncate: true});
    return queryInterface.sequelize.transaction(function(t) {
    return Promise.all(data.map(typeData => {

      return TemplateItem.create(typeData, { logging:false}).catch(function(e) { console.log (e); })
    }));
    });
  },

  down: function() {
    return TemplateItem.destroy({truncate: true});
  }
};
