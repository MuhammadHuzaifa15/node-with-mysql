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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth2_1 = require("passport-google-oauth2");
const CredentialRepository = __importStar(require("../src/repositories/Credential"));
const UserRepository = __importStar(require("../src/repositories/User"));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (obj, done) {
    done(null, obj);
});
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: `${process.env.GOOGLE_API_KEY}`,
    clientSecret: `${process.env.GOOGLE_SECRET_KEY}`,
    callbackURL: `${process.env.APP === "dev"
        ? "http://127.0.0.1:5000"
        : "https://bgn-user-service.herokuapp.com"}/api/auth/google/callback`,
    passReqToCallback: true,
}, function (request, accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, given_name, family_name, picture } = profile._json;
            const credential = yield CredentialRepository.getByEmail(email);
            let user;
            let onBoarding = true;
            if (credential) {
                user = yield UserRepository.getByCredentialId(credential.dataValues.id);
                user = user.dataValues;
                user.email = email;
                onBoarding = false;
            }
            else {
                user = {
                    email,
                    firstName: given_name,
                    lastName: family_name,
                    imgUrl: picture,
                };
            }
            done(null, { user, onBoarding });
        }
        catch (err) {
            done(err, null);
        }
    });
}));
exports.default = passport_1.default;
