"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingDtoStubs = void 0;
const mongoose_1 = require("mongoose");
const settingDtoStubs = (dto) => {
    return {
        clientId: new mongoose_1.Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
        offlineTime: 65106156,
        peakHourStart: 21,
        peakHourEnd: 0,
        precariousVoltageAbove: '233,250',
        precariousVoltageBelow: '231,233',
        criticalVoltageAbove: '231,233',
        criticalVoltageBelow: '191,202',
        ...dto,
    };
};
exports.settingDtoStubs = settingDtoStubs;
//# sourceMappingURL=settingDTO.stub.js.map