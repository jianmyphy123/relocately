const Sequelize = require('sequelize');
const db = require('../index');

const PackagingType = db.define('packaging_types', {
  name: Sequelize.JSONB
}, { timestamps: false });

module.exports = PackagingType;
