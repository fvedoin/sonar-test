"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areaDtoStubs = void 0;
const mongoose_1 = require("mongoose");
const areaDtoStubs = (dto) => {
    return {
        name: 'Area 1',
        clientId: new mongoose_1.Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
        points: [
            {
                lat: null,
                lng: null,
            },
        ],
        ...dto,
    };
};
exports.areaDtoStubs = areaDtoStubs;
//# sourceMappingURL=areaDTO.stub.js.map