"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.libDirsNormalizer = void 0;
var fs_1 = require("fs");
var libDirsNormalizer = function (options, callback) {
    var _a, _b;
    var dirs = (0, fs_1.readdirSync)(options.cwd, { withFileTypes: true });
    var globalIgnoreStr = (0, fs_1.readFileSync)('.buildignore', { encoding: 'utf8' });
    var globalIgnore = globalIgnoreStr
        .split(/\r?\n/)
        .filter(function (line) { return line.trim() !== '' && line.charAt(0) !== '#'; });
    for (var i = 0; i < dirs.length; i++) {
        var dir = dirs[i];
        if (!dir.isDirectory() ||
            ((_b = __spreadArray(__spreadArray([], ((_a = options === null || options === void 0 ? void 0 : options.exclude) !== null && _a !== void 0 ? _a : []), true), globalIgnore, true)) === null || _b === void 0 ? void 0 : _b.includes(dir.name))) {
            continue;
        }
        callback(dir);
    }
};
exports.libDirsNormalizer = libDirsNormalizer;
