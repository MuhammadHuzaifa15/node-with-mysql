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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Middlewares
const auth_1 = __importDefault(require("../middleware/auth"));
// Services
const userService = __importStar(require("../services/userService"));
// Helpers
const models_1 = require("../helpers/models");
class UserController {
    constructor() {
        this.path = "/api/users";
        this.router = express_1.Router();
        this.intializeRoutes = () => {
            this.router.get(`${this.path}/me`, auth_1.default(), this.getLoggedInUser);
            this.router.get(`${this.path}/:userId`, auth_1.default(), this.getUserById);
        };
        this.getUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userService.getByIdAsync({ id: req.params.userId });
                return res.status(result.status).json(result.getBody());
            }
            catch (err) {
                console.log(err.message);
                const result = new models_1.response(500).setMsg("Server error");
                return res.status(result.status).json(result.getBody());
            }
        });
        this.getLoggedInUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userService.getByIdAsync(req.body.user);
                return res.status(result.status).json(result.getBody());
            }
            catch (err) {
                console.log(err.message);
                const result = new models_1.response(500).setMsg("Server error");
                return res.status(result.status).json(result.getBody());
            }
        });
        this.intializeRoutes();
    }
}
exports.default = UserController;
