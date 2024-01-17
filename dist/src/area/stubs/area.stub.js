"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areaStubs = void 0;
const mongoose_1 = require("mongoose");
const areaStubs = (areaDtoStubs) => {
    const parsedPoints = areaDtoStubs.points.map(({ lng, lat }) => ({
        type: 'Point',
        coordinates: [lng, lat],
    }));
    return {
        ...areaDtoStubs,
        points: parsedPoints,
        _id: new mongoose_1.Types.ObjectId('4edd40c86762e0fb12000003'),
    };
};
exports.areaStubs = areaStubs;
//# sourceMappingURL=area.stub.js.map