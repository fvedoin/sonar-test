"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUserStub = void 0;
const mongoose_1 = require("mongoose");
const Role_1 = require("../../auth/models/Role");
const currentUserStub = () => {
    return {
        id: new mongoose_1.Types.ObjectId().toString(),
        username: 'admin@admin.com.br',
        name: 'admin',
        clientId: new mongoose_1.Types.ObjectId().toString(),
        modules: ['qualityGB'],
        accessLevel: Role_1.Role.SUPER_ADMIN,
    };
};
exports.currentUserStub = currentUserStub;
//# sourceMappingURL=currentUser.stub.js.map