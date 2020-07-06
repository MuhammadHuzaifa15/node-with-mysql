"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = __importStar(require("sequelize"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
const sequelize = new Sequelize.Sequelize({
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
const models = {};
fs.readdirSync(__dirname)
    .filter((file) => {
    return (file.indexOf(".") !== 0 &&
        file !== "index.ts" &&
        file !== "interfaces" &&
        file.slice(-3) === ".ts");
})
    .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    models[model.name] = model;
});
// Execute the associations where defined
Object.keys(models).map((modelName) => {
    const model = models[modelName];
    if (model.associate) {
        model.associate(models);
    }
});
sequelize.addHook("afterFind", (data, options) => {
    if (data) {
        data = [].concat(data);
        convertDateIntoMilliSeconds(data, options);
    }
});
const convertDateIntoMilliSeconds = (data, options) => {
    data.forEach((record) => {
        if (options.model) {
            options.model._dateAttributes.forEach((dateAttribute) => {
                if (record[dateAttribute]) {
                    record.setDataValue(dateAttribute, new Date(record[dateAttribute]).getTime());
                }
            });
        }
    });
};
exports.Database = sequelize;
exports.Models = models;
exports.Operators = exports.Database.Op;
