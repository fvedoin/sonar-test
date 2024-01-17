"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChangeLogWithId = void 0;
const mongoose_1 = require("mongoose");
const createChangeLogWithId = (createChangelogDto) => {
    return {
        ...createChangelogDto,
        _id: new mongoose_1.Types.ObjectId('4edd40c86762e0fb12000003'),
    };
};
exports.createChangeLogWithId = createChangeLogWithId;
//# sourceMappingURL=changelog.stub.js.map