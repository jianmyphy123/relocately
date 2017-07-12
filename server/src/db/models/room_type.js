const Sequelize = require('sequelize');
const db = require('../index');

const RoomType = db.define('room_type', {
  name: Sequelize.JSONB
}, { timestamps: false });

module.exports = RoomType;
