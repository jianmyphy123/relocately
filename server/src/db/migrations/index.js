const Umzug = require('umzug');
const chalk = require('chalk');
const db = require('../index');

function migrate() {
  return db.authenticate()
    .then(function() {
      require('../models');
      return db.sync();
    }).then(function() {
      const umzug = new Umzug({
        storage: 'sequelize',
        storageOptions: {
          sequelize: db
        },
        migrations: {
          path: __dirname,
          pattern: /^\d+[\w-]+\.js$/,
          params: [db.getQueryInterface(), db.constructor]
        }
      });

      return umzug.pending().then(migrations => {
        if (migrations.length === 0) {
          console.log(`${chalk.white.underline('No migrations to run')} -- ${chalk.green('application starting normally')}`);
          return false;
        }

        console.log(`${chalk.yellow.underline(`${migrations.length} migration${migrations.length > 1 ? 's' : ''} pending`)} -- running them sequentially`);

        return umzug.up().then(function() {
          console.log(`${chalk.green.underline(`${migrations.length} migration${migrations.length > 1 ? 's' : ''} applied`)} -- application ready to use`);
        });
      });
    });
}


module.exports = migrate;
