"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupInterval = void 0;
const getGroupInterval = (start, end) => {
    let interval;
    if (end.getTime() - start.getTime() <= 86400000) {
        interval = '15m';
    }
    else if (end.getTime() - start.getTime() > 86400000 &&
        end.getTime() - start.getTime() <= 172800000) {
        interval = '30m';
    }
    else if (end.getTime() - start.getTime() > 172800000 &&
        end.getTime() - start.getTime() <= 691200000) {
        interval = '1h';
    }
    else if (end.getTime() - start.getTime() > 691200000 &&
        end.getTime() - start.getTime() <= 2592000000) {
        interval = '6h';
    }
    else if (end.getTime() - start.getTime() > 2592000000 &&
        end.getTime() - start.getTime() <= 15552000000) {
        interval = '12h';
    }
    else if (end.getTime() - start.getTime() > 15552000000 &&
        end.getTime() - start.getTime() <= 31540000000) {
        interval = '1d';
    }
    else if (end.getTime() - start.getTime() > 31540000000 &&
        end.getTime() - start.getTime() <= 63080000000) {
        interval = '2d';
    }
    else if (end.getTime() - start.getTime() > 63080000000 &&
        end.getTime() - start.getTime() <= 94620000000) {
        interval = '3d';
    }
    else {
        interval = '6d';
    }
    return interval;
};
exports.getGroupInterval = getGroupInterval;
//# sourceMappingURL=getGroupInterval.js.map