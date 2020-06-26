const fs = require("fs");
const path = require("path");
const CONFIG = require("../../config/config");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);

type Imodels = {
  [key: string]: any;
};

const db: Imodels = {};

const sequelize = new Sequelize(
  CONFIG.db_name,
  CONFIG.db_user,
  CONFIG.db_password,
  {
    host: CONFIG.db_host,
    dialect: CONFIG.db_dialect,
    port: CONFIG.db_port,
    operatorsAliases: false,
  }
);

fs.readdirSync(__dirname)
  .filter((file: any) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts"
    );
  })
  .forEach((file: any) => {
    let model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
