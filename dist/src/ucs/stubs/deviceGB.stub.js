"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceGBStub = void 0;
const mongoose_1 = require("mongoose");
const deviceGBStub = (id = '6401fdaf1224add8ade50026', deviceGb) => {
    return {
        _id: new mongoose_1.Types.ObjectId(id),
        allows: [],
        clientId: new mongoose_1.Types.ObjectId('6401fdaf1224add8ade50026'),
        devId: '768',
        bucketId: new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6'),
        name: 'UC 768 desativada',
        communication: 'PIMA',
        type: 'LoRa',
        description: '',
        applicationId: new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6'),
        ...deviceGb,
    };
};
exports.deviceGBStub = deviceGBStub;
//# sourceMappingURL=deviceGB.stub.js.map