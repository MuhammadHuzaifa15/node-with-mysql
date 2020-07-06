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
const models_1 = require("../helpers/models");
// Get User By Id
const getByIdAsync = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = params;
    const user = yield UserRepository.getById(id);
    // Response
    if (!user) {
        return new models_1.response(404).setMsg("User not found!");
    }
    return new models_1.response(200, user);
});
exports.getByIdAsync = getByIdAsync;
