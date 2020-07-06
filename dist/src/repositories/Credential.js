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
const Credential = index_1.Models.credential;
exports.getByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return Credential.findOne({ where: { email, isDeleted: false } });
});
exports.create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return Credential.create(payload);
});
exports.updatePassword = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    return Credential.update({ password }, { where: { id, isDeleted: false } });
});
