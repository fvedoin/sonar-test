"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucketDtoStubs = exports.bucketStubs = void 0;
const mongoose_1 = require("mongoose");
const bucketStubs = (_id, dto) => ({
    _id,
    name: 'fox-iot-telemedicao-b',
    ...dto,
});
exports.bucketStubs = bucketStubs;
const bucketDtoStubs = (dto) => {
    return {
        name: 'fox-iot-telemedicao-b',
        influxConnectionId: new mongoose_1.Types.ObjectId().toString(),
        clientId: new mongoose_1.Types.ObjectId().toString(),
        alias: 'Bucket Smart Trafo',
        product: 'smart-trafo',
        ...dto,
    };
};
exports.bucketDtoStubs = bucketDtoStubs;
//# sourceMappingURL=bucket.stub.js.map