const dbConfig = require("../db.config.js");

const Sequelize = require("sequelize");
const Sequelizecn = new Sequelize(dbConfig.DB, dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operationsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
})
const db = {};
db.sequelize = Sequelizecn;
module.exports = db;

