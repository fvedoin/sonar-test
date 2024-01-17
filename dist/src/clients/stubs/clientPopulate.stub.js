"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientPopulateStub = void 0;
const mongoose_1 = require("mongoose");
const clientPopulateStub = () => {
    return {
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
    };
};
exports.clientPopulateStub = clientPopulateStub;
//# sourceMappingURL=clientPopulate.stub.js.map