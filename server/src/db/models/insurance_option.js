const Sequelize = require('sequelize');
const db = require('../index');

const InsuranceOption = db.define('insurance_options', {
  name: Sequelize.JSONB
}, { timestamps: false });

module.exports = InsuranceOption;
