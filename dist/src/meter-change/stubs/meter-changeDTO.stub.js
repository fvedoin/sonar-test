"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meterChangeDtoStubs = void 0;
const meterChangeDtoStubs = (dto) => {
    return {
        clientId: '5f8b4c4e4e0c3d3f8c8b4567',
        deviceId: '640667dd2d824a3ec7cde788',
        ucCode: '123123',
        lastConsumedOldMeter: 1000,
        firstConsumedNewMeter: 20,
        changedAt: new Date('2022-03-29T00:00:00.00Z'),
        firstGeneratedNewMeter: 30,
        lastGeneratedOldMeter: 20,
        ...dto,
    };
};
exports.meterChangeDtoStubs = meterChangeDtoStubs;
//# sourceMappingURL=meter-changeDTO.stub.js.map