"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceFakes = void 0;
const mongoose_1 = require("mongoose");
const deviceFakes = (_id, bucketId) => ({
    _id: new mongoose_1.Types.ObjectId(_id),
    allows: ['quality', 'measurements', 'faults', 'cutReconnect'],
    clientId: new mongoose_1.Types.ObjectId('63fdef9d4f531800316c6b75'),
    devId: new mongoose_1.Types.ObjectId().toString(),
    type: 'LoRa',
    communication: 'ABNT NBR 14522',
    bucketId,
    description: null,
    name: 'Dispositivo (Beta)',
    applicationId: new mongoose_1.Types.ObjectId('619b87d595593f1f9c97f2c7'),
});
exports.deviceFakes = deviceFakes;
//# sourceMappingURL=device.stub.js.map