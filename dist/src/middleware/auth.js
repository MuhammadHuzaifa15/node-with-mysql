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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepository = __importStar(require("../repositories/User"));
const jwt = __importStar(require("jsonwebtoken"));
const CONFIG = require("../../config/config");
// Helpers
const { response } = require("../helpers/models");
const authMiddleware = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            const result = new response(401).setMsg("Authorisation failed. Token not found.");
            return res.status(result.status).json(result.getBody());
        }
        try {
            // Decode Token
            const decoded = jwt.verify(token, CONFIG.jwt_secret);
            //@ts-ignore
            req.body.user = decoded.user;
            if (roles) {
                //@ts-ignore
                if (!(yield hasAnyRole(decoded.user.id, roles))) {
                    const result = new response(403).setMsg("Authorisation failed. Action not allowed.");
                    return res.status(result.status).json(result.getBody());
                }
            }
            next();
        }
        catch (err) {
            console.log(err.message);
            const result = new response(401).setMsg("Authorisation failed.");
            return res.status(result.status).json(result.getBody());
        }
    });
};
const hasAnyRole = (id, roles) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserRepository.getUserRole(id);
    // @ts-ignore
    if (roles.includes(user === null || user === void 0 ? void 0 : user.dataValues.type)) {
        return true;
    }
    return false;
});
exports.default = authMiddleware;
