"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFaultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_fault_dto_1 = require("./create-fault.dto");
class UpdateFaultDto extends (0, swagger_1.PartialType)(create_fault_dto_1.CreateFaultDto) {
}
exports.UpdateFaultDto = UpdateFaultDto;
//# sourceMappingURL=update-fault.dto.js.map