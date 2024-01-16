const Sequelize = require('sequelize');
const dbConfig = require('./data.config')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
    }
);

module.exports = sequelize;