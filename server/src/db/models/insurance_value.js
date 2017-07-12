const Sequelize = require('sequelize');
const db = require('../index');

const InsuranceValue = db.define('insurance_values', {
  name: Sequelize.JSONB
}, { timestamps: false });

module.exports = InsuranceValue;
