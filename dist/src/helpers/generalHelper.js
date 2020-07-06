"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// capitalize string
const capitalize = (val) => val.charAt(0).toUpperCase() + val.slice(1);
exports.capitalize = capitalize;
// Sort By most recent
const sortByDate = (array, dateField) => array.sort((a, b) => {
    a = new Date(a[dateField]);
    b = new Date(b[dateField]);
    return a > b ? -1 : a < b ? 1 : 0;
});
exports.sortByDate = sortByDate;
const generateId = () => {
    let dt = new Date().getTime();
    const uuid = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
};
exports.generateId = generateId;
const getDataDictionary = (data) => {
    let dataDictionary = {};
    for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
            dataDictionary = Object.assign(Object.assign({}, dataDictionary), { [key]: data[key] });
        }
    }
    return dataDictionary;
};
exports.getDataDictionary = getDataDictionary;
const convertDocToJSON = (data) => {
    return JSON.parse(JSON.stringify(data));
};
exports.convertDocToJSON = convertDocToJSON;
const codeGenerator = () => {
    const randomString = (length, chars) => {
        var result = "";
        for (var i = length; i > 0; --i)
            result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    };
    var rString = randomString(6, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    return rString;
};
exports.codeGenerator = codeGenerator;
