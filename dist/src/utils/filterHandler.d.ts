import mongoose from 'mongoose';
export declare type filterCriteria = {
    [keyof: string]: mongoose.Types.ObjectId;
} | {
    [keyof: string]: {
        $regex: unknown;
        $options: 'i';
    };
} | {
    [keyof: string]: {
        $in: string[];
    };
} | {
    [keyof: string]: {
        [keyof: string]: any;
    };
};
export declare function handleFilters(filters?: any[], keyOfDateRange?: string): filterCriteria[];
