"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const User_1 = __importDefault(require("./src/controllers/User"));
const Auth_1 = __importDefault(require("./src/controllers/Auth"));
const CONFIG = require("./config/config");
const port = CONFIG.port || 5000;
const app = new app_1.default([new User_1.default(), new Auth_1.default()], port);
app.listen();
