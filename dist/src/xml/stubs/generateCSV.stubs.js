"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCSVStubs = void 0;
const generateCSVStubs = (dateRange, ucsCodes) => ({
    nameFile: 'teste',
    ucCodes: ucsCodes || ['10249'],
    dateRange: dateRange || {
        startDate: new Date(1672935579000).toISOString(),
        endDate: new Date(1680145199999).toISOString(),
    },
    aggregation: '30m',
    fields: [
        'current_phase_a',
        'current_phase_c',
        'consumed_total_energy',
        'generated_total_energy',
        'frequency',
    ],
});
exports.generateCSVStubs = generateCSVStubs;
//# sourceMappingURL=generateCSV.stubs.js.map