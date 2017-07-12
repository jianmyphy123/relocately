const Sequelize = require('sequelize');
const db = require('../index');

const ItemType = db.define('item_types', {
  name: Sequelize.JSONB
}, { timestamps: false });

module.exports = ItemType;
