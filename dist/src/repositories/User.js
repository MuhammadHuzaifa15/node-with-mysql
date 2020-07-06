"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../models/index");
const User = index_1.Models.users;
exports.create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return User.create(payload);
});
exports.updateUserVerification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return User.update({ isVerified: true }, { where: { id } });
});
exports.getByCredentialId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return User.findOne({
        where: { credentialId: id },
    });
});
exports.getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return User.findOne({
        attributes: [
            "id",
            "firstName",
            "lastName",
            "imgUrl",
            "dateOfBirth",
            "gender",
            "phoneNumber",
            "type",
        ],
        include: [
            {
                model: index_1.Models.credential,
                as: "credential",
                attributes: ["email"],
            },
            {
                model: index_1.Models.address,
                as: "address",
                attributes: [
                    "deliveryAddress",
                    "type",
                    "area",
                    "city",
                    "additionalInfo",
                ],
            },
        ],
        where: { id: id },
    });
});
exports.getUserCredentialId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return User.findOne({
        attributes: ["id", "credentialId"],
        where: { id: id },
    });
});
exports.getUserRole = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return User.findOne({
        attributes: ["type"],
        where: { id: id },
    });
});
