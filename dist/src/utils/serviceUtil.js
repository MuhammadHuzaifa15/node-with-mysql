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
const { to } = require("await-to-js");
const pe = require("parse-error");
module.exports.to = (promise) => __awaiter(void 0, void 0, void 0, function* () {
    let err, res;
    [err, res] = yield to(promise);
    if (err)
        return [pe(err)];
    return [null, res];
});
module.exports.ReE = function (res, err, code) {
    // Error Web Response
    if (typeof err == "object" && typeof err.message != "undefined") {
        err = err.message;
    }
    if (typeof code !== "undefined")
        res.statusCode = code;
    return res.json({ success: false, error: err });
};
module.exports.ReS = function (res, data, code) {
    // Success Web Response
    let send_data = { success: true };
    if (typeof data == "object") {
        send_data = Object.assign(data, send_data); //merge the objects
    }
    if (typeof code !== "undefined")
        res.statusCode = code;
    return res.json(send_data);
};
module.exports.TE = function (err_message, log) {
    // TE stands for Throw Error
    if (log === true) {
        console.error(err_message);
    }
    throw new Error(err_message);
};
