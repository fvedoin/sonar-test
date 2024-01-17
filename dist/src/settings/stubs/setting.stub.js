"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingStubs = void 0;
const mongoose_1 = require("mongoose");
const settingStubs = (createSettingDto) => {
    return {
        ...createSettingDto,
        _id: new mongoose_1.Types.ObjectId('4edd40c86762e0fb12000003'),
    };
};
exports.settingStubs = settingStubs;
//# sourceMappingURL=setting.stub.js.map