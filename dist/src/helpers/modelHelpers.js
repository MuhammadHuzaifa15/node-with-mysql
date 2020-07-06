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
const generalHelper_1 = require("./generalHelper");
// check if record exists
const ifNotExist = (records) => __awaiter(void 0, void 0, void 0, function* () {
    for (const record of records) {
        const { model, id, name, field } = record;
        if (id) {
            if (Array.isArray(id)) {
                for (const elem of id) {
                    if (typeof elem === "object" &&
                        elem instanceof Object &&
                        !Array.isArray(elem)) {
                        let exists = yield model
                            .findById(elem[field])
                            .and({ isDeleted: false });
                        if (!exists) {
                            return name;
                        }
                    }
                    else {
                        let exists = yield model.findById(elem).and({ isDeleted: false });
                        if (!exists) {
                            return name;
                        }
                    }
                }
            }
            else {
                let exists = yield model.findById(id).and({ isDeleted: false });
                if (!exists) {
                    return name;
                }
            }
        }
    }
});
exports.ifNotExist = ifNotExist;
// check if record is new
const ifExists = (model, fields) => __awaiter(void 0, void 0, void 0, function* () {
    for (const field in generalHelper_1.getDataDictionary(fields)) {
        let exists = yield model.findOne().and([
            {
                [field]: { $exists: true },
            },
            { [field]: fields[field] },
            { isDeleted: false },
        ]);
        if (exists) {
            return field;
        }
    }
    return;
});
exports.ifExists = ifExists;
