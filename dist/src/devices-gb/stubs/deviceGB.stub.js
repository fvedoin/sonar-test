"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceGBStub = void 0;
const mongoose_1 = require("mongoose");
const bucket_stub_1 = require("./bucket.stub");
const deviceGBStub = (id = '6401fdaf1224add8ade50026', deviceGb) => {
    return {
        _id: new mongoose_1.Types.ObjectId(id),
        allows: [],
        clientId: new mongoose_1.Types.ObjectId('6401fdaf1224add8ade50026'),
        devId: '768',
        bucketId: (0, bucket_stub_1.bucketStub)(),
        name: 'UC 768 desativada',
        communication: 'PIMA',
        type: 'LoRa',
        description: '',
        applicationId: {
            _id: new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6'),
            clientId: new mongoose_1.Types.ObjectId('6401fdaf1224add8ade50026'),
            appId: 'qnponwwn49tv6khs',
            name: 'Application Telemedição Grupo B',
            token: '123',
            description: '',
        },
        ...deviceGb,
    };
};
exports.deviceGBStub = deviceGBStub;
//# sourceMappingURL=deviceGB.stub.js.map