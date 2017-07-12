const Sequelize = require('sequelize');
const db = require('../index');

const TemplateItem = db.define('template_items', {
  type: Sequelize.INTEGER,
  category: Sequelize.STRING,
  name: Sequelize.JSONB,
  length: {
    type: Sequelize.DECIMAL(11, 6),
    allowNull: true
  },
  width: {
    type: Sequelize.DECIMAL(11, 6),
    allowNull: true
  },
  depth: {
    type: Sequelize.DECIMAL(11, 6),
    allowNull: true
  },
  weight: {
    type: Sequelize.DECIMAL(11, 6),
    allowNull: true,
    defaultValue: 0
  },
  replacement_value: {
    type: Sequelize.DECIMAL(11, 4),
    allowNull: true,
    defaultValue: 0
  },
  dismantling_factor: Sequelize.DECIMAL(10, 6),
  duration_dismantling: Sequelize.INTEGER,
  duration_assembly: Sequelize.INTEGER,
  surface: Sequelize.DECIMAL(11, 6),
  volume_assembled: Sequelize.DECIMAL(11, 6),
  volume_dismantled: Sequelize.DECIMAL(11, 6),
  bubble_wrap_factor: Sequelize.INTEGER,
  bubble_wrap_width: Sequelize.DECIMAL(11, 6),
  mattress_covers: Sequelize.BOOLEAN,
  crating_possible: Sequelize.BOOLEAN,
  crate: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  dismantling: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  packed_by: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  unpacked: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  assembling: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  one_man_handling: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  customer_volume: Sequelize.DECIMAL(11, 6),
  duration_dismantling_customer: Sequelize.INTEGER,
  duration_assembly_customer: Sequelize.INTEGER
}, { timestamps: false });

module.exports = TemplateItem;
