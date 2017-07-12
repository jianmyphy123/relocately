const Sequelize = require('sequelize');
const db = require('../index');

const Item = db.define('items', {
  api_id: Sequelize.STRING,
  type: Sequelize.INTEGER,
  category: Sequelize.STRING,
  name: Sequelize.JSONB,
  length: Sequelize.DECIMAL(11, 6),
  width: Sequelize.DECIMAL(11, 6),
  weight: Sequelize.DECIMAL(11, 6),
  depth: Sequelize.DECIMAL(11, 6),
  dismantling_factor: Sequelize.DECIMAL(10, 9),
  duration_dismantling: Sequelize.INTEGER,
  replacement_value: Sequelize.DECIMAL(11, 4),
  crate: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  dismantling: Sequelize.INTEGER,
  room_type: Sequelize.INTEGER,
  packed_by: Sequelize.INTEGER,
  unpacking: Sequelize.INTEGER,
  one_man_handling: Sequelize.INTEGER,
  assembling: Sequelize.INTEGER,
  RV_CV: Sequelize.INTEGER,
  insurance_option: Sequelize.INTEGER,
  insurance_value: Sequelize.INTEGER,
  description: Sequelize.TEXT,
  amount: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
}, { timestamps: false });

module.exports = Item;
