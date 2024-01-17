"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFilters = void 0;
const mongoose_1 = require("mongoose");
function handleFilters(filters = [], keyOfDateRange) {
    return filters.map((filter) => {
        const [key, value] = Object.entries(filter)[0];
        if (typeof value === 'string') {
            if (key.includes('_id')) {
                return {
                    [key]: new mongoose_1.default.Types.ObjectId(value),
                };
            }
            return {
                [key]: {
                    $regex: value,
                    $options: 'i',
                },
            };
        }
        if (Array.isArray(value)) {
            if (key.includes('_id')) {
                return {
                    [key]: {
                        $in: value.map((id) => new mongoose_1.default.Types.ObjectId(id)),
                    },
                };
            }
            const filter = {
                $or: value.map((item) => {
                    if (Number.isInteger(item)) {
                        return { [key]: item };
                    }
                    else {
                        return {
                            [key]: {
                                $regex: item,
                                $options: 'i',
                            },
                        };
                    }
                }),
            };
            return filter;
        }
        if (typeof value === 'object') {
            const [_, ObjectValue] = Object.entries(filter)[0];
            if (key === 'dateRange' && keyOfDateRange) {
                const ObjectValue_ = ObjectValue;
                return {
                    $and: [
                        {
                            [keyOfDateRange]: {
                                $gte: new Date(ObjectValue_.startDate || new Date('2020')),
                            },
                        },
                        {
                            [keyOfDateRange]: {
                                $lte: new Date(ObjectValue_.endDate || new Date()),
                            },
                        },
                    ],
                };
            }
        }
        return filter;
    });
}
exports.handleFilters = handleFilters;
//# sourceMappingURL=filterHandler.js.map