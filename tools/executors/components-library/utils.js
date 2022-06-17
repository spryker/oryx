"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.libDirsNormalizer = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const libDirsNormalizer = (options, callback) => {
    const dirs = (0, fs_1.readdirSync)(options.cwd);
    const globalIgnoreStr = (0, fs_1.readFileSync)('.buildignore', { encoding: 'utf8' });
    const globalIgnore = globalIgnoreStr
        .split(/\r?\n/)
        .filter((line) => line.trim() !== '' && line.charAt(0) !== '#');
    const generated = {};
    while (dirs.length) {
        const dir = dirs[0];
        const dirData = typeof dir === 'string'
            ? {
                name: dir,
                path: dir,
            }
            : {
                name: dir.name,
                path: `${dir.path}/${dir.name}`,
            };
        const dirFullPath = (0, path_1.join)(options.cwd, dirData.path);
        if (!(0, fs_1.lstatSync)(dirFullPath).isDirectory() ||
            [...(options?.exclude ?? []), ...globalIgnore]?.includes(dirData.name) ||
            generated[dirData.name]) {
            dirs.shift();
            continue;
        }
        if ((0, fs_1.existsSync)(`${dirFullPath}/index.ts`)) {
            generated[dirData.name] = true;
            callback(dirData);
            dirs.shift();
            continue;
        }
        const nestedDirs = (0, fs_1.readdirSync)(dirFullPath);
        for (let i = 0; i < nestedDirs.length; i++) {
            dirs.push({
                name: nestedDirs[i],
                path: dirData.path,
            });
        }
        dirs.shift();
    }
};
exports.libDirsNormalizer = libDirsNormalizer;
