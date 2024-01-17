"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeToken = void 0;
function makeToken(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.makeToken = makeToken;
//# sourceMappingURL=tokens.js.map