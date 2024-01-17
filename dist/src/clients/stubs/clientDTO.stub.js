"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientDtoStubs = void 0;
const clientDtoStubs = (dto) => {
    return {
        name: 'Client 1',
        initials: 'Clnt',
        cnpj: '79.379.491/0008-50',
        local: 'Santa Maria',
        address: 'Av. Roraima, 1000',
        modules: [],
        ...dto,
    };
};
exports.clientDtoStubs = clientDtoStubs;
//# sourceMappingURL=clientDTO.stub.js.map