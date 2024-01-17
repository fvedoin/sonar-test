"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertArrayStringsToInt = exports.updateQueryStringParameter = exports.generateRandomQueryParams = exports.makeid = exports.convertPropertiesToBoolean = exports.convertPropertiesToInt = exports.transformAndInvertCase = void 0;
function transformAndInvertCase(inputString) {
    const transformedString = inputString.replace(/./g, (char) => {
        if (/[a-zA-Z]/.test(char)) {
            return char === char.toLowerCase()
                ? char.toUpperCase()
                : char.toLowerCase();
        }
        return char;
    });
    return transformedString;
}
exports.transformAndInvertCase = transformAndInvertCase;
function convertPropertiesToInt(obj) {
    const newObj = {};
    for (const key in obj) {
        newObj[key] = parseInt(obj[key]);
    }
    return newObj;
}
exports.convertPropertiesToInt = convertPropertiesToInt;
function convertPropertiesToBoolean(filter) {
    return filter.map((item) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        if (key === 'ucs' && value['$exists']) {
            return { [key]: { $exists: value['$exists'] === 'true' } };
        }
        return { [key]: value };
    });
}
exports.convertPropertiesToBoolean = convertPropertiesToBoolean;
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
exports.makeid = makeid;
function generateRandomQueryParams(url, length = 5) {
    const randomQueryParamsKey = makeid(length);
    const randomQueryParamsValue = makeid(length);
    return updateQueryStringParameter(url, randomQueryParamsKey, randomQueryParamsValue);
}
exports.generateRandomQueryParams = generateRandomQueryParams;
function updateQueryStringParameter(uri, key, value) {
    const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + '=' + value + '$2');
    }
    else {
        return uri + separator + key + '=' + value;
    }
}
exports.updateQueryStringParameter = updateQueryStringParameter;
function convertArrayStringsToInt(filter) {
    return filter.map((item) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        if (Array.isArray(value)) {
            const intValueArray = value.map((item) => {
                const intValue = parseInt(item);
                return !isNaN(intValue) ? intValue : item;
            });
            return { [key]: intValueArray };
        }
        else {
            return { [key]: value };
        }
    });
}
exports.convertArrayStringsToInt = convertArrayStringsToInt;
//# sourceMappingURL=utils.js.map