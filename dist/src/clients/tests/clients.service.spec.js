"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_stub_1 = require("../stubs/user.stub");
jest.mock('../clients.repository');
const user = (0, user_stub_1.userStub)();
describe('ClientsService', () => {
    it('should be defined user', () => {
        expect(user).toBeDefined();
    });
});
//# sourceMappingURL=clients.service.spec.js.map