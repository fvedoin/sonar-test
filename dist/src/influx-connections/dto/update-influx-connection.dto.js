"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInfluxConnectionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_influx_connection_dto_1 = require("./create-influx-connection.dto");
class UpdateInfluxConnectionDto extends (0, swagger_1.PartialType)(create_influx_connection_dto_1.CreateInfluxConnectionDto) {
}
exports.UpdateInfluxConnectionDto = UpdateInfluxConnectionDto;
//# sourceMappingURL=update-influx-connection.dto.js.map