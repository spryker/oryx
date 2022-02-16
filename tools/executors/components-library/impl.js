"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsc_impl_1 = require("@nrwl/workspace/src/executors/tsc/tsc.impl");
const fs_1 = require("fs");
const path_1 = require("path");
async function componentsLibraryExecutor(options, context) {
    await (0, tsc_impl_1.default)(options, context);
    const getDirectories = (source) => (0, fs_1.readdirSync)(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    const dirs = getDirectories((0, path_1.resolve)(options.outputPath));
    const excludeDirs = ['public'];
    dirs
        .filter((dir) => !excludeDirs.includes(dir))
        .forEach((dir) => {
        (0, fs_1.writeFileSync)((0, path_1.resolve)(`${options.outputPath}/${dir}/package.json`), JSON.stringify({
            name: dir,
            version: getVersion(`${options.outputPath}/package.json`),
            main: './src/index.js',
            typings: `./src/index.d.ts`,
        }, null, 2));
    });
    return { success: true };
}
exports.default = componentsLibraryExecutor;
const getVersion = (pathToPackageJson) => {
    const rawData = (0, fs_1.readFileSync)((0, path_1.resolve)(pathToPackageJson), 'utf8');
    const parsedData = JSON.parse(rawData);
    if (!parsedData.version) {
        throw new Error(`The version for the component could not be detected from the package.json (${pathToPackageJson})`);
    }
    return parsedData.version;
};
