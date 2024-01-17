"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientStub = void 0;
const mongoose_1 = require("mongoose");
const clientStub = (_id) => {
    return {
        name: 'User teste',
        _id: new mongoose_1.Types.ObjectId(_id),
        address: 'Testing Address',
        cnpj: '00000000000',
        initials: 'TTT',
        local: '',
        modules: ['test'],
    };
};
exports.clientStub = clientStub;
//# sourceMappingURL=clientDTO.stub.js.map