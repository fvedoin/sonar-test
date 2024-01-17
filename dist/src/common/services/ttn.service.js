"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TtnService = void 0;
const axios_1 = require("axios");
require('dotenv').config();
exports.TtnService = axios_1.default.create({
    baseURL: process.env.TTN_HOST,
});
exports.TtnService.interceptors.request.use(async (config) => {
    config.headers.Authorization = `Bearer ${process.env.TTN_TOKEN}`;
    return config;
});
exports.TtnService.interceptors.response.use((response) => response, function (error) {
    if (error?.config?.url.includes('gs/gateways/') &&
        error?.config?.url.includes('/connection/stats')) {
        return error.response;
    }
    return Promise.reject(error);
});
//# sourceMappingURL=ttn.service.js.map