"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findQualityDtoStubs = void 0;
const findQualityDtoStubs = () => {
    return {
        fields: 'r["_field"] == "drp_phase_a" or r["_field"] == "drp_phase_b" or r["_field"] == "drp_phase_c" or r["_field"] == "drc_phase_a" or r["_field"] == "drc_phase_b" or r["_field"] == "drc_phase_c"',
        devsIds: 'r["dev_id"] == "fxrl-00"',
        begin: 1662394779,
        end: 1667665179,
        bucket: 'fox-iot-telemedicao-b',
    };
};
exports.findQualityDtoStubs = findQualityDtoStubs;
//# sourceMappingURL=findQualityDto.stub.js.map