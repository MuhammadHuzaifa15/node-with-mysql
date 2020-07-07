import * as Sequelize from "sequelize";
import * as fs from "fs";
import * as path from "path";
import { IModelFactory } from "../interfaces/models";
const Op = Sequelize.Op;
const CONFIG = require("../../config/config");

const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col,
};

const sequelize: Sequelize.Sequelize = new Sequelize.Sequelize({
  database: CONFIG.db_name,
  username: CONFIG.db_user,
  password: CONFIG.db_password,
  host: CONFIG.db_host,
  dialect: CONFIG.db_dialect,
  port: CONFIG.db_port,
  timezone: process.env.MYSQL_TIMEZONE || "+00:00",
  dialectOptions: {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  },
  operatorsAliases,
});

let fileExt = CONFIG.app === "production" ? ".js" : ".ts";

const models: IModelFactory = {} as any;
fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== `index${fileExt}` &&
      file !== "interfaces" &&
      file.slice(-3) === fileExt
    );
  })
  .forEach((file: string) => {
    const model = sequelize.import(path.join(__dirname, file));
    models[(model as any).name] = model;
  });

// Execute the associations where defined
Object.keys(models).map((modelName) => {
  const model: Sequelize.Model<any, any> = models[modelName];
  if (model.associate) {
    model.associate(models);
  }
});

sequelize.addHook("afterFind", (data: any, options: any) => {
  if (data) {
    data = [].concat(data);
    convertDateIntoMilliSeconds(data, options);
  }
});

const convertDateIntoMilliSeconds = (data: any, options: any) => {
  data.forEach((record: any) => {
    if (options.model) {
      options.model._dateAttributes.forEach((dateAttribute: any) => {
        if (record[dateAttribute]) {
          record.setDataValue(
            dateAttribute,
            new Date(record[dateAttribute]).getTime()
          );
        }
      });
    }
  });
};

export const Database: Sequelize.Sequelize = sequelize;
export const Models: IModelFactory = models;
export const Operators: Sequelize.Operators = Database.Op;
