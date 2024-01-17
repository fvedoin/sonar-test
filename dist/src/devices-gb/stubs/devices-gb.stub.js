"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceGbStub = void 0;
const mongoose_1 = require("mongoose");
const deviceGbStub = () => {
    return {
        _id: new mongoose_1.Types.ObjectId('63ca917253899d9c2e48a713'),
        clientId: new mongoose_1.Types.ObjectId('63ca917253899d9c2e48a713'),
        applicationId: new mongoose_1.Types.ObjectId('63ca917253899d9c2e48a713'),
        bucketId: new mongoose_1.Types.ObjectId('63ca917253899d9c2e48a713'),
        communication: 'PIMA',
        type: 'LoRa',
        devId: 'fxrl-00',
        name: 'fxrl-00',
        description: '',
        allows: ['Qualidade', 'faltas'],
    };
};
exports.deviceGbStub = deviceGbStub;
//# sourceMappingURL=devices-gb.stub.js.map