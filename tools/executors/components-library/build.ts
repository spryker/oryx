import { ExecutorContext, readJsonFile, writeJsonFile } from '@nrwl/devkit';
import { TypeScriptExecutorOptions } from '@nrwl/workspace/src/executors/tsc/schema';
import tsc from '@nrwl/workspace/src/executors/tsc/tsc.impl';
import { Dirent, existsSync, rmdirSync } from 'fs';
import { join } from 'path';
import { libDirsNormalizer, LibOptions } from './utils';

export interface ComponentsLibraryBuildExecutorOptions
  extends TypeScriptExecutorOptions,
    LibOptions {}

const normalizeOptions = (
  options: ComponentsLibraryBuildExecutorOptions
): ComponentsLibraryBuildExecutorOptions => {
  options = { ...options };

  options.outputPath = join(options.outputPath, options.cwd);
  options.main = join(options.cwd, options.main);
  options.tsConfig = join(options.cwd, options.tsConfig);

  if (options.assets.length) {
    for (let i = 0; i < options.assets.length; i++) {
      const asset = options.assets[i];

      if (typeof asset === 'string') {
        options.assets[i] = join(options.cwd, options.assets[i]);

        continue;
      }

      options.assets[i].input = join(options.cwd, options.assets[i].input);
    }
  }

  return options;
};

export default async function componentsLibraryBuildExecutor(
  baseOptions: ComponentsLibraryBuildExecutorOptions,
  context: ExecutorContext
) {
  baseOptions.cwd = context.workspace.projects[context.projectName].root;

  const options = normalizeOptions(baseOptions);
  const packageJson = readJsonFile(join(options.cwd, 'package.json'));
  const tmpPath = join(context.root, 'tmp');

  packageJson.exports = packageJson.exports ?? {};
  await tsc(options, context);

  libDirsNormalizer(options, (dir: Dirent) => {
    const dirName = dir.name === 'src' ? '.' : dir.name;

    packageJson.exports[dirName] = {
      default: `./${dir.name}/index.js`,
      types: `./${dir.name}/index.d.ts`,
    };
  });

  writeJsonFile(join(options.outputPath, 'package.json'), packageJson);

  if (existsSync(tmpPath)) {
    rmdirSync(tmpPath, { recursive: true });
  }

  return { success: true };
}
