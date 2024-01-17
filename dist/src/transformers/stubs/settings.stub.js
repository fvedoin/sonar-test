"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsStub = void 0;
const mongoose_1 = require("mongoose");
const settingsStub = ({ _id, clientId }) => {
    return {
        _id: new mongoose_1.Types.ObjectId(_id),
        clientId: new mongoose_1.Types.ObjectId(clientId),
        criticalVoltageAbove: '',
        criticalVoltageBelow: '',
        offlineTime: 0,
        peakHourEnd: 20,
        peakHourStart: 60,
        precariousVoltageAbove: '',
        precariousVoltageBelow: '',
    };
};
exports.settingsStub = settingsStub;
//# sourceMappingURL=settings.stub.js.map