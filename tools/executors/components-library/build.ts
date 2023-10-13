import {
  ExecutorContext,
  joinPathFragments,
  readJsonFile,
  writeJsonFile,
} from '@nx/devkit';
import { AssetGlob } from '@nx/js/src/utils/assets/assets';
import { CopyAssetsHandler } from '@nx/js/src/utils/assets/copy-assets-handler';
import { existsSync, rmdirSync } from 'fs';
import runCommands from 'nx/src/executors/run-commands/run-commands.impl';
import { join } from 'path';
import { DirData, LibOptions, libDirsNormalizer } from './utils';

export interface ComponentsLibraryBuildExecutorOptions extends LibOptions {
  tsConfig: string;
  main: string;
  outputPath: string;
  exclude: string[];
  assets: (string | AssetGlob)[];
}

const normalizeOptions = (
  options: ComponentsLibraryBuildExecutorOptions
): ComponentsLibraryBuildExecutorOptions => {
  options = { ...options };

  options.outputPath = join(options.outputPath, options.cwd);
  options.main = join(options.cwd, options.main);

  return options;
};

export default async function componentsLibraryBuildExecutor(
  baseOptions: ComponentsLibraryBuildExecutorOptions,
  context: ExecutorContext
) {
  baseOptions.cwd = context.workspace.projects[context.projectName].root;
  const projectRoot = joinPathFragments(context.root, baseOptions.cwd);

  const options = normalizeOptions(baseOptions);
  const packageJson = readJsonFile(join(options.cwd, 'package.json'));
  const tmpPath = join(context.root, 'tmp');

  packageJson.exports = packageJson.exports ?? {};

  await runCommands(
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
    const assetHandler = new CopyAssetsHandler({
      projectDir: projectRoot,
      rootDir: options.cwd,
      outputDir: options.outputPath,
      assets: options.assets,
    });

    await assetHandler.processAllAssetsOnce();
  }

  libDirsNormalizer(options, (dir: DirData) => {
    const { name: dirName, path: dirPath } = dir;
    const dirKey = dirName === 'src' ? '.' : `./${dirName}`;

    packageJson.exports[dirKey] = {
      types: `./${dirPath}/index.d.ts`,
      default: `./${dirPath}/index.js`,
    };
  });

  writeJsonFile(join(options.outputPath, 'package.json'), packageJson);

  if (existsSync(tmpPath)) {
    rmdirSync(tmpPath, { recursive: true });
  }

  return { success: true };
}
