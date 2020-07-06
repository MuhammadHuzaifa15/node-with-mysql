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
const OTP = index_1.Models.otp;
exports.getByToken = (code, type, userId) => __awaiter(void 0, void 0, void 0, function* () {
    let criteria = {};
    criteria = { code, type };
    criteria.isDeleted = false;
    if (userId)
        criteria.userId = userId;
    return OTP.findOne({ where: criteria });
});
exports.create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return OTP.create(payload);
});
exports.update = (code, type) => __awaiter(void 0, void 0, void 0, function* () {
    return OTP.update({ isDeleted: true }, { where: { code, type } });
});
