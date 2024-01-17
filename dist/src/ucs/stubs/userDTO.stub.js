"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDTOStub = void 0;
const mongoose_1 = require("mongoose");
const userDTOStub = (dto) => {
    return {
        name: 'User test',
        accessLevel: 'admin',
        clientId: new mongoose_1.Types.ObjectId('6401fdaf1224add8ade50026').toString(),
        modules: [
            'qualityGB',
            'exportGB',
            'alertsGB',
            'cutReconnectGB',
            'faultsGB',
            'qualityTR',
            'exportTR',
            'alertsTR',
        ],
        password: '123456',
        username: 'ucs@test.com.br',
        ...dto,
    };
};
exports.userDTOStub = userDTOStub;
//# sourceMappingURL=userDTO.stub.js.map