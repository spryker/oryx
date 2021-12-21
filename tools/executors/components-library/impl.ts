import { ExecutorContext } from '@nrwl/devkit';
import tsc from '@nrwl/workspace/src/executors/tsc/tsc.impl';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export interface ComponentsLibraryExecutorOptions {
  outputPath: string;
  main: string;
  tsConfig: string;
  assets: [];
}

export default async function componentsLibraryExecutor(
  options: ComponentsLibraryExecutorOptions,
  context: ExecutorContext
) {
  await tsc(options, context);

  const getDirectories = (source) =>
    readdirSync(source, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

  const dirs = getDirectories(resolve(options.outputPath));
  const excludeDirs = ['public'];

  dirs
    .filter((dir) => !excludeDirs.includes(dir))
    .forEach((dir) => {
      writeFileSync(
        resolve(`${options.outputPath}/${dir}/package.json`),
        JSON.stringify(
          {
            name: dir,
            version: getVersion(`${options.outputPath}/package.json`),
            main: './src/index.js',
            typings: `./src/index.d.ts`,
          },
          null,
          2
        )
      );
    });

  return { success: true };
}

const getVersion = (pathToPackageJson: string): string => {
  const rawData = readFileSync(resolve(pathToPackageJson), 'utf8');
  const parsedData = JSON.parse(rawData);

  if (!parsedData.version) {
    throw new Error(
      `The version for the component could not be detected from the package.json (${pathToPackageJson})`
    );
  }
  return parsedData.version;
};
