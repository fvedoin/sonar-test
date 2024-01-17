"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientStub = void 0;
const mongoose_1 = require("mongoose");
const clientStub = (id) => {
    return {
        _id: new mongoose_1.Types.ObjectId(id),
        active: true,
        users: [],
        name: 'Fox IoT',
        local: 'Santa Maria',
        address: 'Avenida Roraima 100, ITSM, Prédio 02, Sala 23',
        initials: 'FX',
        cnpj: '27.077.377/0001-03',
        aneelcode: '12345',
        __v: 0,
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
    };
};
exports.clientStub = clientStub;
//# sourceMappingURL=client.stub.js.map