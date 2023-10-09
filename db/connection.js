const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('thoughts', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.log('Enable to connect with database', error);
}

module.exports = sequelize;
