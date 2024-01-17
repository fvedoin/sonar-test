"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInfluxBucketDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_influx_bucket_dto_1 = require("./create-influx-bucket.dto");
class UpdateInfluxBucketDto extends (0, swagger_1.PartialType)(create_influx_bucket_dto_1.CreateInfluxBucketDto) {
}
exports.UpdateInfluxBucketDto = UpdateInfluxBucketDto;
//# sourceMappingURL=update-influx-bucket.dto.js.map