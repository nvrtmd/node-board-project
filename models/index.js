const path = require("path");
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";

const config = require(path.join(__dirname, "..", "config", "config.js"))[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Post = require("./post.js")(sequelize, Sequelize);
db.User = require("./user.js")(sequelize, Sequelize);

module.exports = db;
