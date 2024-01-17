"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertGatewayStubs = void 0;
const mongoose_1 = require("mongoose");
const alertGatewayStubs = (alertGatewayDtoStubs) => {
    return {
        ...alertGatewayDtoStubs,
        _id: new mongoose_1.Types.ObjectId('4edd40c86762e0fb12000003'),
    };
};
exports.alertGatewayStubs = alertGatewayStubs;
//# sourceMappingURL=alertGateway.stub.js.map