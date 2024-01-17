"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceGBStub = void 0;
const mongoose_1 = require("mongoose");
const deviceGBStub = (id) => {
    return {
        _id: new mongoose_1.Types.ObjectId(id),
        allows: [],
        clientId: new mongoose_1.Types.ObjectId('60953b5f9925823178397e3f'),
        devId: 'ucd-768',
        bucketId: new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6'),
        name: 'UC 768 desativada',
        communication: '',
        type: '',
        description: '',
        applicationId: new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6'),
    };
};
exports.deviceGBStub = deviceGBStub;
//# sourceMappingURL=deviceGB.stub.js.map