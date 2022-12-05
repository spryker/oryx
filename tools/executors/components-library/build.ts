import {
  ExecutorContext,
  joinPathFragments,
  readJsonFile,
  writeJsonFile,
} from '@nrwl/devkit';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { existsSync, rmdirSync } from 'fs';
import { join } from 'path';
import { DirData, libDirsNormalizer, LibOptions } from './utils';

export interface ComponentsLibraryBuildExecutorOptions extends LibOptions {
  tsConfig: string;
  main: string;
  outputPath: string;
  exclude: string[];
  assets: (
    | {
        input: string;
      }
    | string
  )[];
}

const normalizeOptions = (
  options: ComponentsLibraryBuildExecutorOptions
): ComponentsLibraryBuildExecutorOptions => {
  options = { ...options };

  options.outputPath = join(options.outputPath, options.cwd);
  options.main = join(options.cwd, options.main);

  if (options.assets.length) {
    for (let i = 0; i < options.assets.length; i++) {
      const asset = options.assets[i];

      if (typeof asset === 'string') {
        options.assets[i] = join(options.cwd, asset);

        continue;
      }

      asset.input = join(options.cwd, asset.input);
    }
  }

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
