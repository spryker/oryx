"use strict";
exports.__esModule = true;
exports.libDirsNormalizer = void 0;
var fs_1 = require("fs");
var libDirsNormalizer = function (options, callback) {
    var _a;
    var dirs = (0, fs_1.readdirSync)(options.cwd, { withFileTypes: true });
    for (var i = 0; i < dirs.length; i++) {
        var dir = dirs[i];
        if (!dir.isDirectory() ||
            ((_a = options.exclude) === null || _a === void 0 ? void 0 : _a.includes(dir.name)) ||
            dir.name.startsWith('.')) {
            continue;
        }
        callback(dir);
    }
};
exports.libDirsNormalizer = libDirsNormalizer;
