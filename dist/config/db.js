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
const models_1 = require("../src/models");
const CONFIG = require("../config/config");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    models_1.Database.authenticate()
        .then(() => {
        console.log("Connected to SQL database:", CONFIG.db_name);
    })
        .catch((err) => {
        console.error("Unable to connect to SQL database:", CONFIG.db_name, err);
        process.exit(1);
    });
    if (CONFIG.app === "dev") {
        models_1.Database.sync();
    }
});
exports.default = connectDB;
