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
    const user = sequelize.define("users", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            defaultValue: function () {
                return generalHelper_1.generateId();
            },
            allowNull: false,
        },
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING,
        imgUrl: Sequelize.STRING,
        dateOfBirth: Sequelize.STRING,
        gender: Sequelize.STRING,
        isVerified: Sequelize.BOOLEAN,
        phoneNumber: Sequelize.STRING,
        type: Sequelize.ENUM("merchant", "consumer", "admin"),
        credentialId: {
            type: Sequelize.STRING,
            references: {
                model: "credentials",
                key: "id",
            },
        },
        addressId: {
            type: Sequelize.STRING,
            references: {
                model: "addresses",
                key: "id",
            },
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    user.associate = function (models) {
        user.belongsTo(models.credential, {
            foreignKey: "credentialId",
            as: "credential",
        });
        user.belongsTo(models.address, {
            foreignKey: "addressId",
            as: "address",
        });
    };
    return user;
}
exports.default = default_1;
