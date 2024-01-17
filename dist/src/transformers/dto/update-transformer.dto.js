"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTransformerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_transformer_dto_1 = require("./create-transformer.dto");
class UpdateTransformerDto extends (0, swagger_1.PartialType)(create_transformer_dto_1.CreateTransformerDto) {
}
exports.UpdateTransformerDto = UpdateTransformerDto;
//# sourceMappingURL=update-transformer.dto.js.map