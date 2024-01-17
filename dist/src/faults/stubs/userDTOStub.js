"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDTOStub = void 0;
const mongoose_1 = require("mongoose");
const userDTOStub = () => {
    const id = new mongoose_1.Types.ObjectId().toString();
    return {
        name: 'test faults',
        accessLevel: 'admin',
        clientId: id,
        modules: ['test'],
        password: '123456',
        username: `test@faults.com.br`,
    };
};
exports.userDTOStub = userDTOStub;
//# sourceMappingURL=userDTOStub.js.map