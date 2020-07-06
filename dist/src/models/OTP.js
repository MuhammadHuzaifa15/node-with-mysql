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
const generalHelper_1 = require("../helpers/generalHelper");
/**
 * Defining main sequelize function for binding on the model index
 *
 * @param {Sequelize.Sequelize} sequelize
 * @returns
 */
function default_1(sequelize) {
    const otp = sequelize.define("otp", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            defaultValue: function () {
                return generalHelper_1.generateId();
            },
            allowNull: false,
        },
        code: Sequelize.STRING,
        expiredUTC: Sequelize.STRING,
        userId: Sequelize.STRING,
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        type: Sequelize.ENUM("reset-password", "email-verification"),
    });
    return otp;
}
exports.default = default_1;
