"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.influxConnectionStubDtoStubs = exports.influxConnectionStub = void 0;
const influxConnectionStub = (_id, dto) => ({
    _id,
    name: 'fox-iot-telemedicao-b',
    ...dto,
});
exports.influxConnectionStub = influxConnectionStub;
const influxConnectionStubDtoStubs = (dto) => {
    return {
        apiToken: '',
        alias: '',
        host: '',
        orgId: 'fox-iot',
        ...dto,
    };
};
exports.influxConnectionStubDtoStubs = influxConnectionStubDtoStubs;
//# sourceMappingURL=influxConnection.stub.js.map