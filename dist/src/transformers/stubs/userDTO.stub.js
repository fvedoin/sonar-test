"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDTOStub = void 0;
const mongoose_1 = require("mongoose");
const userDTOStub = () => {
    return {
        name: 'User teste',
        accessLevel: 'admin',
        clientId: new mongoose_1.Types.ObjectId().toString(),
        modules: ['test'],
        password: '3333',
        username: 'transformersdevices@test.com.br',
    };
};
exports.userDTOStub = userDTOStub;
//# sourceMappingURL=userDTO.stub.js.map