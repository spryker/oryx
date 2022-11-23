"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nrwl/devkit");
const run_commands_impl_1 = require("@nrwl/workspace/src/executors/run-commands/run-commands.impl");
const fs_1 = require("fs");
const path_1 = require("path");
const utils_1 = require("./utils");
const normalizeOptions = (options) => {
    options = { ...options };
    options.outputPath = (0, path_1.join)(options.outputPath, options.cwd);
    options.main = (0, path_1.join)(options.cwd, options.main);
    if (options.assets.length) {
        for (let i = 0; i < options.assets.length; i++) {
            const asset = options.assets[i];
            if (typeof asset === 'string') {
                options.assets[i] = (0, path_1.join)(options.cwd, asset);
                continue;
            }
            asset.input = (0, path_1.join)(options.cwd, asset.input);
        }
    }
    return options;
};
async function componentsLibraryBuildExecutor(baseOptions, context) {
    baseOptions.cwd = context.workspace.projects[context.projectName].root;
    const projectRoot = (0, devkit_1.joinPathFragments)(context.root, baseOptions.cwd);
    const options = normalizeOptions(baseOptions);
    const packageJson = (0, devkit_1.readJsonFile)((0, path_1.join)(options.cwd, 'package.json'));
    const tmpPath = (0, path_1.join)(context.root, 'tmp');
    packageJson.exports = packageJson.exports ?? {};
    await (0, run_commands_impl_1.default)({
        command: `npx tsc ${baseOptions.tsConfig ? '-p ' + baseOptions.tsConfig : ''}`,
        cwd: projectRoot,
        __unparsed__: [],
    }, context);
    (0, utils_1.libDirsNormalizer)(options, (dir) => {
        const { name: dirName, path: dirPath } = dir;
        const dirKey = dirName === 'src' ? '.' : `./${dirName}`;
        packageJson.exports[dirKey] = {
            default: `./${dirPath}/index.js`,
            types: `./${dirPath}/index.d.ts`,
        };
    });
    (0, devkit_1.writeJsonFile)((0, path_1.join)(options.outputPath, 'package.json'), packageJson);
    if ((0, fs_1.existsSync)(tmpPath)) {
        (0, fs_1.rmdirSync)(tmpPath, { recursive: true });
    }
    return { success: true };
}
exports.default = componentsLibraryBuildExecutor;
