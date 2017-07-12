const Sequelize = require('sequelize');
const db = require('../index');

const DismantlingType = db.define('dismantling_types', {
  name: Sequelize.JSONB
}, { timestamps: false });

module.exports = DismantlingType;
