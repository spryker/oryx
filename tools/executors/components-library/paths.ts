import { ExecutorContext, readJsonFile, writeJsonFile } from '@nrwl/devkit';
import { Dirent } from 'fs';
import { join } from 'path';
import { libDirsNormalizer, LibOptions } from './utils';

export interface ComponentsLibraryPathsExecutorOptions extends LibOptions {
  name: string;
  update: boolean;
}

export default async function componentsLibraryPathsExecutor(
  options: ComponentsLibraryPathsExecutorOptions,
  context: ExecutorContext
) {
  options.cwd = context.workspace.projects[context.projectName].root;

  const packageJson = readJsonFile(join(options.cwd, 'package.json'));
  const tsConfigPath = join(context.root, options.name);
  const tsConfig = readJsonFile(tsConfigPath);
  const realConfig = JSON.stringify(tsConfig);
  const prePaths = {};
  const postPaths = {};
  const libPaths = {};
  let isPost = false;

  for (const key in tsConfig.compilerOptions.paths) {
    const isCurrentLib = key.includes(packageJson.name);

    if (!isPost && !isCurrentLib) {
      prePaths[key] = tsConfig.compilerOptions.paths[key];
    }

    if (isPost && !isCurrentLib) {
      postPaths[key] = tsConfig.compilerOptions.paths[key];
    }

    if (isCurrentLib) {
      if (!isPost) {
        isPost = true;
      }

      delete tsConfig.compilerOptions.paths[key];
    }
  }

  libDirsNormalizer(options, (dir: Dirent) => {
    const { name: dirName } = dir;
    const pathKey = dirName === 'src' ? '' : `/${dirName}`;

    libPaths[`${packageJson.name}${pathKey}`] = [
      `${options.cwd}/${dirName}/index.ts`,
    ];
  });

  if (packageJson.exports) {
    for (const key in packageJson.exports) {
      libPaths[`${packageJson.name}/${key}`] = [
        join(
          options.cwd,
          packageJson.exports[key].default.replace(/.js$/, '.ts')
        ),
      ];
    }
  }

  tsConfig.compilerOptions.paths = {
    ...prePaths,
    ...libPaths,
    ...postPaths,
  };

  const generatedConfig = JSON.stringify(tsConfig);

  if (!options.update && generatedConfig !== realConfig) {
    console.error(`Please, update ${options.name}`);

    return { success: false };
  }

  if (options.update) {
    writeJsonFile(tsConfigPath, tsConfig);
  }

  return { success: true };
}
