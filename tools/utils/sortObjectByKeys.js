"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortObjectByKeys = void 0;
const sortObjectByKeys = (source) => {
    return Object.keys(source)
        .sort()
        .reduce((obj, key) => ({
        ...obj,
        [key]: source[key],
    }), {});
};
exports.sortObjectByKeys = sortObjectByKeys;
//# sourceMappingURL=sortObjectByKeys.js.map