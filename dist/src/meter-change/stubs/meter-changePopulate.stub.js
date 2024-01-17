"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meterChangesPopulateStub = void 0;
const mongoose_1 = require("mongoose");
const meterChangesPopulateStub = () => {
    return {
        _id: new mongoose_1.Types.ObjectId('63ca917253899d9c2e48a713'),
        lastConsumedOldMeter: 1000,
        clientId: {
            _id: new mongoose_1.Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
            name: 'Client 1',
            initials: 'CL1',
            cnpj: '12345678901234',
            aneelcode: '',
            local: '',
            address: '',
            active: true,
            modules: [''],
            parentId: new mongoose_1.Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
        },
        deviceId: {
            _id: new mongoose_1.Types.ObjectId('640667dd2d824a3ec7cde788'),
            allows: [],
            clientId: new mongoose_1.Types.ObjectId('60953b5f9925823178397e3f'),
            devId: 'ucd-768',
            bucketId: new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6'),
            name: 'UC 768 desativada',
            communication: '',
            type: '',
            description: '',
            applicationId: new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6'),
        },
        ucCode: '123123',
        firstConsumedNewMeter: 20,
        firstGeneratedNewMeter: 30,
        lastGeneratedOldMeter: 20,
        changedAt: new Date('2022-03-29T00:00:00.000Z'),
    };
};
exports.meterChangesPopulateStub = meterChangesPopulateStub;
//# sourceMappingURL=meter-changePopulate.stub.js.map