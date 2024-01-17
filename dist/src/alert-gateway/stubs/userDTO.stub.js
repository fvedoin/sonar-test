"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDTOStub = void 0;
const mongoose_1 = require("mongoose");
const userDTOStub = () => {
    return {
        name: 'User test',
        accessLevel: 'admin',
        clientId: new mongoose_1.Types.ObjectId().toString(),
        modules: ['test'],
        password: '123456',
        username: 'alertGateway@test.com.br',
    };
};
exports.userDTOStub = userDTOStub;
//# sourceMappingURL=userDTO.stub.js.map