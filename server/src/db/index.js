const Sequelize = require('sequelize');


const sequelize = new Sequelize(
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB_NAME}`,
  {
    logging: false,
    dialect: 'postgresql',
    dialectOptions: {
      ssl: true
    }
  }
);

module.exports = sequelize;
