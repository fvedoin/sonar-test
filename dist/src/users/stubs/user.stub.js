"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStub = exports.userFromJtwStub = void 0;
const mongoose_1 = require("mongoose");
const userFromJtwStub = () => {
    return {
        id: '5f8b4c4e4e0c3d3f8c8b4567',
        username: 'users@test.com.br',
        name: 'User test',
        clientId: '5f8b4c4e4e0c3d3f8c8b4567',
        modules: ['test'],
        accessLevel: 'admin',
    };
};
exports.userFromJtwStub = userFromJtwStub;
const userStub = () => {
    return {
        _id: new mongoose_1.Types.ObjectId(),
        username: 'users@test.com.br',
        name: 'User test',
        clientId: new mongoose_1.Types.ObjectId(),
        modules: ['test'],
        accessLevel: 'admin',
        password: 'password',
        active: false,
        attempts: 0,
        blocked: false,
        createdAt: new Date(),
        image: '',
        codeExpiredAt: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
        generatedCode: 1000,
    };
};
exports.userStub = userStub;
//# sourceMappingURL=user.stub.js.map