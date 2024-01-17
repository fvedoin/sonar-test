"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApiAccessControlDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_api_access_control_dto_1 = require("./create-api-access-control.dto");
class UpdateApiAccessControlDto extends (0, swagger_1.PartialType)(create_api_access_control_dto_1.CreateApiAccessControlDto) {
}
exports.UpdateApiAccessControlDto = UpdateApiAccessControlDto;
//# sourceMappingURL=update-api-access-control.dto.js.map