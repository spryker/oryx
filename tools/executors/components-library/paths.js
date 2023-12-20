"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nrwl/devkit");
const fs_1 = require("fs");
const path_1 = require("path");
const prettier_1 = require("prettier");
const utils_1 = require("../../utils");
const utils_2 = require("./utils");
async function componentsLibraryPathsExecutor(options, context) {
    options.cwd = context.workspace.projects[context.projectName].root;
    const packageJson = (0, devkit_1.readJsonFile)((0, path_1.join)(options.cwd, 'package.json'));
    const tsConfigPath = (0, path_1.join)(context.root, options.name);
    const tsConfig = (0, devkit_1.readJsonFile)(tsConfigPath);
    const realConfig = JSON.stringify(tsConfig);
    for (const key in tsConfig.compilerOptions.paths) {
        if (key.includes(packageJson.name)) {
            delete tsConfig.compilerOptions.paths[key];
        }
    }
    (0, utils_2.libDirsNormalizer)(options, (dir) => {
        const { name: dirName, path } = dir;
        const pathKey = dirName === 'src' ? '' : `/${dirName}`;
        tsConfig.compilerOptions.paths[`${packageJson.name}${pathKey}`] = [
            `${options.cwd}/${path}/index.ts`,
        ];
    });
    if (packageJson.exports) {
        for (const key in packageJson.exports) {
            tsConfig.compilerOptions.paths[`${packageJson.name}/${key.replace('./', '')}`] = [
                (0, path_1.join)(options.cwd, packageJson.exports[key].default.replace(/.js$/, '.ts')).replace(/\\/g, '/'),
            ];
        }
    }
    tsConfig.compilerOptions.paths = (0, utils_1.sortObjectByKeys)(tsConfig.compilerOptions.paths);
    const generatedConfig = JSON.stringify(tsConfig);
    if (!options.update && generatedConfig !== realConfig) {
        console.error(`Please, update ${options.name} in the ${packageJson.name} library.\nPlease, run command 'nx paths ${context.projectName} --update'
      `);
        return { success: false };
    }
    if (options.update) {
        const prettierConfig = await (0, prettier_1.resolveConfig)(tsConfigPath);
        const formattedConfig = (0, prettier_1.format)(generatedConfig, {
            ...prettierConfig,
            filepath: tsConfigPath,
        });
        (0, fs_1.writeFileSync)(tsConfigPath, formattedConfig);
    }
    return { success: true };
}
exports.default = componentsLibraryPathsExecutor;
//# sourceMappingURL=paths.js.map