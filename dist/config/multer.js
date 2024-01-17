"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = require("multer");
const path_1 = require("path");
const crypto_1 = require("crypto");
exports.default = {
    storage: (0, multer_1.diskStorage)({
        destination: (0, path_1.resolve)(__dirname, '..', 'uploads', 'images'),
        filename(_, file, callback) {
            const hash = (0, crypto_1.randomBytes)(6).toString('hex');
            const fileName = `${hash}-${file.originalname}`;
            callback(null, fileName);
        },
    }),
};
//# sourceMappingURL=multer.js.map