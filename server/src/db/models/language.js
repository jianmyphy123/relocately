const Sequelize = require('sequelize');
const db = require('../index');

const Language = db.define('languages', {
  code: Sequelize.STRING,
  text: Sequelize.STRING
}, { timestamps: false });

module.exports = Language;
