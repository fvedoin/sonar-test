"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ucStub = void 0;
const mongoose_1 = require("mongoose");
const ucStub = (clientId) => {
    return {
        ucCode: '10108',
        status: 'Online',
        lastHour: {
            min: 0,
            max: 0,
        },
        clientId,
        deviceId: {
            _id: new mongoose_1.Types.ObjectId('61a8f7d1a1017b2168ce0000'),
            allows: ['quality', 'measurements', 'faults', 'cutReconnect'],
            clientId: '63fdef9d4f531800316c6b75',
            devId: 'fxrl-00',
            type: 'LoRa',
            communication: 'ABNT NBR 14522',
            __v: 0,
            bucketId: '62179b4f4e4e0029f068f7b6',
            description: null,
            name: 'Dispositivo (Beta)',
            applicationId: new mongoose_1.Types.ObjectId('61a8f7d1a1017b2168ce00db'),
        },
    };
};
exports.ucStub = ucStub;
//# sourceMappingURL=uc.stub.js.map