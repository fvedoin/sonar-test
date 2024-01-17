"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertHistoryPopulateStub = void 0;
const mongoose_1 = require("mongoose");
const alertHistoryPopulateStub = () => {
    return {
        _id: new mongoose_1.Types.ObjectId('63ca917253899d9c2e48a713'),
        alertType: 'UC',
        alertName: '111',
        alertAllows: 'Custom Allows',
        alertVariables: 'IA - Corrente na fase A (A)',
        alertValue: '0',
        operator: '>',
        sentEmail: ['brunoalvestavares@foxiot.com'],
        alertTime: new Date('2023-08-30T14:00:00Z'),
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
    };
};
exports.alertHistoryPopulateStub = alertHistoryPopulateStub;
//# sourceMappingURL=alertsHistoryPopulate.stub.js.map