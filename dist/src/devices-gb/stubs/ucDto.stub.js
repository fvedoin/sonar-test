"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ucDtoStubs = void 0;
const mongoose_1 = require("mongoose");
const ucDtoStubs = (dto) => {
    return {
        clientId: '6401fdaf1224add8ade50026',
        transformerId: new mongoose_1.Types.ObjectId('640667dd2d824a3ec7cde77f').toString(),
        deviceId: new mongoose_1.Types.ObjectId('640667dd2d824a3ec7cde788').toString(),
        billingGroup: 0,
        routeCode: 11,
        ucCode: 'string',
        ucNumber: 'string',
        ucClass: 'string',
        group: 'string',
        subClass: 'string',
        subGroup: 'string',
        sequence: 'string',
        phases: 'A',
        circuitBreaker: 0,
        microgeneration: true,
        city: 'string',
        district: 'string',
        latitude: 0,
        longitude: 0,
        ratedVoltage: 220,
        ...dto,
    };
};
exports.ucDtoStubs = ucDtoStubs;
//# sourceMappingURL=ucDto.stub.js.map