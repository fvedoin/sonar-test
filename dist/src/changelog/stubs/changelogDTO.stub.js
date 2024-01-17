"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChangelogDto = void 0;
const createChangelogDto = (dto) => {
    return {
        description: 'Test',
        version: '1.0.0',
        ...dto,
    };
};
exports.createChangelogDto = createChangelogDto;
//# sourceMappingURL=changelogDTO.stub.js.map