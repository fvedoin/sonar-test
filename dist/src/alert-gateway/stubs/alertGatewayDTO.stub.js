"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertGatewayDtoStubs = void 0;
const mongoose_1 = require("mongoose");
const alertGatewayDtoStubs = (dto) => {
    return {
        clientId: new mongoose_1.Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
        emails: ['test@example.com'],
        interval: 2,
        status: 'active',
        ttnId: 'ttn123',
        enabled: true,
        ...dto,
    };
};
exports.alertGatewayDtoStubs = alertGatewayDtoStubs;
//# sourceMappingURL=alertGatewayDTO.stub.js.map