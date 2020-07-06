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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Helpers
const models_1 = require("../helpers/models");
// Services
const authService = __importStar(require("../services/authService"));
// Middleware
const passport_1 = __importDefault(require("../../config/passport"));
// Validations
const authValidations_1 = require("../validations/authValidations");
class AuthController {
    constructor() {
        this.path = "/api/auth";
        this.router = express_1.Router();
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield authService.signUp(req.body);
                const resBody = result.getBody();
                if (result.status == 200) {
                    const { profile, token } = resBody.data;
                    resBody.data = { token, profile };
                }
                return res.status(result.status).json(resBody);
            }
            catch (err) {
                console.log(err.message);
                const result = new models_1.response(500).setMsg("Server error");
                return res.status(result.status).json(result.getBody());
            }
        });
        this.verifyOTP = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield authService.verifyOTP(req.body);
                return res.status(result.status).json(result);
            }
            catch (err) {
                console.log(err.message);
                const result = new models_1.response(500).setMsg("Server error");
                return res.status(result.status).json(result.getBody());
            }
        });
        this.signIn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield authService.signIn(req.body);
                const resBody = result.getBody();
                if (result.status == 200) {
                    const { profile, token } = resBody.data;
                    resBody.data = { token, profile };
                }
                return res.status(result.status).json(resBody);
            }
            catch (err) {
                console.log(err.message);
                const result = new models_1.response(500).setMsg("Server error");
                return res.status(result.status).json(result.getBody());
            }
        });
        this.signInWithGoogle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            try {
                const result = yield authService.signInWithGoogle({
                    user: user.user,
                    onBoarding: user.onBoarding,
                });
                return res.status(result.status).json(result);
            }
            catch (err) {
                console.log(err.message);
                const result = new models_1.response(500).setMsg("Server error");
                return res.status(result.status).json(result.getBody());
            }
        });
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield authService.forgotPasswordAsync(req.body);
                return res.status(result.status).json(result.getBody());
            }
            catch (err) {
                console.log(err.message);
                const result = new models_1.response(500).setMsg("Server error");
                return res.status(result.status).json(result.getBody());
            }
        });
        this.forgotPasswordVerification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield authService.forgotPasswordVerifyAsync({
                    // @ts-ignore
                    code: (_a = req.headers["otp-token"]) === null || _a === void 0 ? void 0 : _a.toString(),
                });
                return res.status(result.status).json(result.getBody());
            }
            catch (err) {
                console.log(err.message);
                const result = new models_1.response(500).setMsg("Server error");
                return res.status(result.status).json(result.getBody());
            }
        });
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield authService.resetPasswordAsync(req.body);
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
    intializeRoutes() {
        this.router.post(`${this.path}/register`, authValidations_1.signUpValidation, this.signUp);
        this.router.put(`${this.path}/verify`, authValidations_1.verifyOTPValidation, this.verifyOTP);
        this.router.post(`${this.path}/login`, authValidations_1.signInValidation, this.signIn);
        this.router.get(`${this.path}/google`, passport_1.default.authenticate("google", {
            scope: [
                "https://www.googleapis.com/auth/plus.login",
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
            ],
        }));
        this.router.get(`${this.path}/google/callback`, passport_1.default.authenticate("google"), this.signInWithGoogle);
        this.router.post(`${this.path}/forgot-password`, authValidations_1.forgotPasswordValidation, this.forgotPassword);
        this.router.get(`${this.path}/forgot-password/verify`, authValidations_1.forgotPasswordVerifyValidation, this.forgotPasswordVerification);
        this.router.put(`${this.path}/reset-password`, authValidations_1.resetPasswordValidation, this.resetPassword);
    }
}
exports.default = AuthController;
