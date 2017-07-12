const Sequelize = require('sequelize');
const db = require('../index');

const RVCV = db.define('rvcv', {
  name: Sequelize.JSONB
}, { timestamps: false });

module.exports = RVCV;
