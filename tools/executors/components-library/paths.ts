import { ExecutorContext, readJsonFile } from '@nrwl/devkit';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { format, resolveConfig } from 'prettier';
import { sortObjectByKeys } from '../../utils';
import { DirData, LibOptions, libDirsNormalizer } from './utils';

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

  for (const key in tsConfig.compilerOptions.paths) {
    if (key.includes(packageJson.name)) {
      delete tsConfig.compilerOptions.paths[key];
    }
  }

  libDirsNormalizer(options, (dir: DirData) => {
    const { name: dirName, path } = dir;
    const pathKey = dirName === 'src' ? '' : `/${dirName}`;

    tsConfig.compilerOptions.paths[`${packageJson.name}${pathKey}`] = [
      `${options.cwd}/${path}/index.ts`,
    ];
  });

  if (packageJson.exports) {
    for (const key in packageJson.exports) {
      tsConfig.compilerOptions.paths[
        `${packageJson.name}/${key.replace('./', '')}`
      ] = [
        join(
          options.cwd,
          packageJson.exports[key].default.replace(/.js$/, '.ts')
        ).replace(/\\/g, '/'),
      ];
    }
  }

  tsConfig.compilerOptions.paths = sortObjectByKeys(
    tsConfig.compilerOptions.paths
  );

  const generatedConfig = JSON.stringify(tsConfig);

  if (!options.update && generatedConfig !== realConfig) {
    console.error(
      `Please, update ${options.name} in the ${packageJson.name} library.\nPlease, run command 'nx paths ${context.projectName} --update'
      `
    );

    return { success: false };
  }

  if (options.update) {
    const prettierConfig = await resolveConfig(tsConfigPath);
    const formattedConfig = format(generatedConfig, {
      ...prettierConfig,
      filepath: tsConfigPath,
    });

    writeFileSync(tsConfigPath, formattedConfig);
  }

  return { success: true };
}
