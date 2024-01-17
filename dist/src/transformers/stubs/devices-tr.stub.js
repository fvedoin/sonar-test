"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceTrStub = void 0;
const mongoose_1 = require("mongoose");
const deviceTrStub = (obj) => {
    return {
        _id: new mongoose_1.Types.ObjectId('63ca917253899d9c2e48a713'),
        name: 'IT 01',
        type: 'Smart Trafo',
        devId: 'SM',
        applicationId: new mongoose_1.Types.ObjectId('619b87d595593f1f9c97f2c7'),
        clientId: new mongoose_1.Types.ObjectId('4edd40c86762e0fb12000002'),
        bucketId: new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6'),
        mqttApplicationId: new mongoose_1.Types.ObjectId('4edd40c86762e0fb12000003'),
        ...obj,
    };
};
exports.deviceTrStub = deviceTrStub;
//# sourceMappingURL=devices-tr.stub.js.map