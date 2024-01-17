"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingPopulateStub = void 0;
const mongoose_1 = require("mongoose");
const settingPopulateStub = () => {
    return {
        _id: new mongoose_1.Types.ObjectId('63ca917253899d9c2e48a713'),
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
        offlineTime: 65106156,
        peakHourStart: 21,
        peakHourEnd: 0,
        precariousVoltageAbove: '233,250',
        precariousVoltageBelow: '231,233',
        criticalVoltageAbove: '231,233',
        criticalVoltageBelow: '191,202',
    };
};
exports.settingPopulateStub = settingPopulateStub;
//# sourceMappingURL=settingPopulate.stub.js.map