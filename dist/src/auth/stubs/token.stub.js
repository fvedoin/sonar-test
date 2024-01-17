"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenStub = void 0;
const mongoose_1 = require("mongoose");
const tokens_1 = require("../../utils/tokens");
const tokenStub = (userId) => {
    return {
        userId: userId || mongoose_1.Types.ObjectId.toString(),
        token: (0, tokens_1.makeToken)(32),
        createdAt: new Date(),
    };
};
exports.tokenStub = tokenStub;
//# sourceMappingURL=token.stub.js.map