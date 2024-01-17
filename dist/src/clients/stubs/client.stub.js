"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientStubs = void 0;
const mongoose_1 = require("mongoose");
const clientStubs = (clientDtoStubs) => {
    return {
        ...clientDtoStubs,
        _id: new mongoose_1.Types.ObjectId('4edd41c86762e5fb12000003'),
    };
};
exports.clientStubs = clientStubs;
//# sourceMappingURL=client.stub.js.map