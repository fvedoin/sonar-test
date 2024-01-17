"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offlineAlertDtoStubs = exports.offlineAlertStubs = void 0;
const mongoose_1 = require("mongoose");
const offlineAlertStubs = (_id, dto) => ({
    _id,
    ...dto,
});
exports.offlineAlertStubs = offlineAlertStubs;
const offlineAlertDtoStubs = (dto) => {
    return {
        alertId: new mongoose_1.Types.ObjectId().toString(),
        deviceId: new mongoose_1.Types.ObjectId().toString(),
        createdAt: new Date(),
        triggerAt: new Date(),
        ...dto,
    };
};
exports.offlineAlertDtoStubs = offlineAlertDtoStubs;
//# sourceMappingURL=offlineAlert.stub.js.map