"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformersAggregateStub = void 0;
const mongoose_1 = require("mongoose");
const transformersAggregateStub = () => {
    return {
        _id: new mongoose_1.Types.ObjectId('63ca917253899d9c2e48a713'),
        it: '12',
        serieNumber: '123456',
        tapLevel: 3,
        tap: 4,
        feeder: 'Feeder 1',
        city: 'City 1',
        loadLimit: 100,
        overloadTimeLimit: 60,
        nominalValue_i: 200,
        clientId: new mongoose_1.Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
        location: {
            type: 'Point',
            coordinates: [50.12345, -20.98765],
        },
    };
};
exports.transformersAggregateStub = transformersAggregateStub;
//# sourceMappingURL=transformerAggregateStub.js.map