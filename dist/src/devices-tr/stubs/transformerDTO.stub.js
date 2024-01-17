"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformersDtoStubs = void 0;
const mongoose_1 = require("mongoose");
const transformersDtoStubs = (it, dto) => {
    return {
        _id: new mongoose_1.Types.ObjectId(),
        location: {
            type: 'Point',
            coordinates: [-52.02435390752231, -28.077725367731027],
        },
        clientId: new mongoose_1.Types.ObjectId().toString(),
        secondaryDeviceId: new mongoose_1.Types.ObjectId().toString(),
        it,
        latitude: -53.75593,
        longitude: -29.69786,
        serieNumber: 'sm-00',
        tap: 75,
        tapLevel: 1,
        feeder: '1',
        city: 'Santa Maria',
        loadLimit: 100,
        overloadTimeLimit: 0,
        nominalValue_i: 0,
        smartTrafoDeviceId: new mongoose_1.Types.ObjectId().toString(),
        ...dto,
    };
};
exports.transformersDtoStubs = transformersDtoStubs;
//# sourceMappingURL=transformerDTO.stub.js.map