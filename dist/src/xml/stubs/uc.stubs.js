"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ucStubs = void 0;
const mongoose_1 = require("mongoose");
const ucStubs = (random) => ({
    ucCode: random || '10249',
    timeZone: 'America/Sao_Paulo',
    deviceId: {
        _id: new mongoose_1.Types.ObjectId('61a8f7d1a1017b2168ce00dc'),
        allows: ['quality', 'measurements', 'faults', 'cutReconnect'],
        clientId: new mongoose_1.Types.ObjectId('63fdef9d4f531800316c6b75'),
        devId: 'fxrl-00',
        type: 'LoRa',
        communication: 'ABNT NBR 14522',
        __v: 0,
        bucketId: new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6'),
        description: null,
        name: 'Dispositivo (Beta)',
        applicationId: new mongoose_1.Types.ObjectId('619b87d595593f1f9c97f2c7'),
    },
});
exports.ucStubs = ucStubs;
//# sourceMappingURL=uc.stubs.js.map