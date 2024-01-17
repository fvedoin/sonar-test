"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumedStub = void 0;
const consumedStub = () => {
    const mockUc = ['uc1', 'uc2'];
    const mockField = 'field1';
    const mockDateRange = {
        startDate: '2023-01-01',
        endDate: '2023-01-31',
    };
    const mockResponse = {
        result: '_result',
        table: 0,
        _value: 0,
        dev_id: '0',
    };
    return {
        mockUc,
        mockField,
        mockDateRange,
        mockResponse,
    };
};
exports.consumedStub = consumedStub;
//# sourceMappingURL=consumed.stub.js.map