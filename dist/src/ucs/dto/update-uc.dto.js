"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUcDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_uc_dto_1 = require("./create-uc.dto");
class UpdateUcDto extends (0, swagger_1.PartialType)(create_uc_dto_1.CreateUcDto) {
}
exports.UpdateUcDto = UpdateUcDto;
//# sourceMappingURL=update-uc.dto.js.map