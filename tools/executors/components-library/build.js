'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const devkit_1 = require('@nx/devkit');
const copy_assets_handler_1 = require('@nx/js/src/utils/copy-assets-handler');
const run_commands_impl_1 = require('@nx/workspace/src/executors/run-commands/run-commands.impl');
const fs_1 = require('fs');
const path_1 = require('path');
const utils_1 = require('./utils');
const normalizeOptions = (options) => {
  options = { ...options };
  options.outputPath = (0, path_1.join)(options.outputPath, options.cwd);
  options.main = (0, path_1.join)(options.cwd, options.main);
  return options;
};
async function componentsLibraryBuildExecutor(baseOptions, context) {
  baseOptions.cwd = context.workspace.projects[context.projectName].root;
  const projectRoot = (0, devkit_1.joinPathFragments)(
    context.root,
    baseOptions.cwd
  );
  const options = normalizeOptions(baseOptions);
  const packageJson = (0, devkit_1.readJsonFile)(
    (0, path_1.join)(options.cwd, 'package.json')
  );
  const tmpPath = (0, path_1.join)(context.root, 'tmp');
  packageJson.exports = packageJson.exports ?? {};
  await (0, run_commands_impl_1.default)(
    {
      command: `npx tsc ${
        baseOptions.tsConfig ? '-p ' + baseOptions.tsConfig : ''
      }`,
      cwd: projectRoot,
      __unparsed__: [],
    },
    context
  );
  if (options.assets) {
    const assetHandler = new copy_assets_handler_1.CopyAssetsHandler({
      projectDir: projectRoot,
      rootDir: options.cwd,
      outputDir: options.outputPath,
      assets: options.assets,
    });
    await assetHandler.processAllAssetsOnce();
  }
  (0, utils_1.libDirsNormalizer)(options, (dir) => {
    const { name: dirName, path: dirPath } = dir;
    const dirKey = dirName === 'src' ? '.' : `./${dirName}`;
    packageJson.exports[dirKey] = {
      types: `./${dirPath}/index.d.ts`,
      default: `./${dirPath}/index.js`,
    };
  });
  (0, devkit_1.writeJsonFile)(
    (0, path_1.join)(options.outputPath, 'package.json'),
    packageJson
  );
  if ((0, fs_1.existsSync)(tmpPath)) {
    (0, fs_1.rmdirSync)(tmpPath, { recursive: true });
  }
  return { success: true };
}
exports.default = componentsLibraryBuildExecutor;
