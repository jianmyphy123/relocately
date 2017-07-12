const Sequelize = require('sequelize');
const db = require('../index');

const ConciergeItems = db.define('concierge_items', {
  api_id: Sequelize.STRING,
  concierge_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  secret: Sequelize.STRING,
}, { timestamps: false });

module.exports = ConciergeItems;
