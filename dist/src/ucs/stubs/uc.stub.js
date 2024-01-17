"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ucStubs = void 0;
const mongoose_1 = require("mongoose");
const ucStubs = (ucDtoStubs, id = '63e53e35be706a6dabdd4837') => {
    return {
        ...ucDtoStubs,
        location: {
            type: 'Point',
            coordinates: [ucDtoStubs.longitude, ucDtoStubs.latitude],
        },
        isCutted: false,
        timeZone: 'America/Sao_Paulo',
        _id: new mongoose_1.Types.ObjectId(id),
    };
};
exports.ucStubs = ucStubs;
//# sourceMappingURL=uc.stub.js.map