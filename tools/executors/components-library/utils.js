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
var path_1 = require("path");
var libDirsNormalizer = function (options, callback) {
    var _a, _b;
    var dirs = (0, fs_1.readdirSync)(options.cwd);
    var globalIgnoreStr = (0, fs_1.readFileSync)('.buildignore', { encoding: 'utf8' });
    var globalIgnore = globalIgnoreStr
        .split(/\r?\n/)
        .filter(function (line) { return line.trim() !== '' && line.charAt(0) !== '#'; });
    var generated = {};
    while (dirs.length) {
        var dir = dirs[0];
        var dirData = typeof dir === 'string'
            ? {
                name: dir,
                path: dir
            }
            : {
                name: dir.name,
                path: "".concat(dir.path, "/").concat(dir.name)
            };
        var dirFullPath = (0, path_1.join)(options.cwd, dirData.path);
        if (!(0, fs_1.lstatSync)(dirFullPath).isDirectory() ||
            ((_b = __spreadArray(__spreadArray([], ((_a = options === null || options === void 0 ? void 0 : options.exclude) !== null && _a !== void 0 ? _a : []), true), globalIgnore, true)) === null || _b === void 0 ? void 0 : _b.includes(dirData.name)) ||
            generated[dirData.name]) {
            dirs.shift();
            continue;
        }
        if ((0, fs_1.existsSync)("".concat(dirFullPath, "/index.ts"))) {
            generated[dirData.name] = true;
            callback(dirData);
            dirs.shift();
            continue;
        }
        var nestedDirs = (0, fs_1.readdirSync)(dirFullPath);
        for (var i = 0; i < nestedDirs.length; i++) {
            dirs.push({
                name: nestedDirs[i],
                path: dirData.path
            });
        }
        dirs.shift();
    }
};
exports.libDirsNormalizer = libDirsNormalizer;
