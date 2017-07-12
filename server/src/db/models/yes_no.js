const Sequelize = require('sequelize');
const db = require('../index');

const YesNo = db.define('yes_no', {
  name: Sequelize.JSONB
}, { timestamps: false });

module.exports = YesNo;
