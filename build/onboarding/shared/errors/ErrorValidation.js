"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOfAny = exports.isOfType = void 0;
const isOfType = (runtimeError, error) => {
    var _a;
    return ((_a = runtimeError === null || runtimeError === void 0 ? void 0 : runtimeError.constructor) === null || _a === void 0 ? void 0 : _a.name) === error;
};
exports.isOfType = isOfType;
const isOfAny = (runtimeError, errorArray) => {
    return errorArray.some((type) => (0, exports.isOfType)(runtimeError, type));
};
exports.isOfAny = isOfAny;
