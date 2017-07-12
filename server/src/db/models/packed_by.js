const Sequelize = require('sequelize');
const db = require('../index');

const PackedBy = db.define('packed_by', {
  name: Sequelize.JSONB
}, { timestamps: false });

module.exports = PackedBy;
