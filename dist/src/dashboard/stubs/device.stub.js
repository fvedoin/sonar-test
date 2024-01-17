"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devicesStub = void 0;
const mongoose_1 = require("mongoose");
const devicesStub = (clientId) => {
    return {
        _id: new mongoose_1.Types.ObjectId('61a8f7d1a1017b2168ce0000'),
        allows: ['quality', 'measurements', 'faults', 'cutReconnect'],
        clientId,
        devId: 'fxrl-00',
        type: 'LoRa',
        communication: 'ABNT NBR 14522',
        bucketId: '62179b4f4e4e0029f068f7b6',
        description: null,
        name: 'Dispositivo (Beta)',
        applicationId: '619b87d595593f1f9c97f2c7',
    };
};
exports.devicesStub = devicesStub;
//# sourceMappingURL=device.stub.js.map