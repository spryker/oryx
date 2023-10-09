import { ExecutorContext } from '@nx/devkit';
import { createProjectGraphAsync } from '@nx/workspace/src/core/project-graph';
import { readFileSync, writeFileSync } from 'fs';
import { getDependencies } from './utils';

export interface DepsExecutorOptions {
  update?: boolean;
}

export default async function depsExecutor(
  options: DepsExecutorOptions,
  context: ExecutorContext
) {
  const { projectName } = context;
  const { update } = options;

  console.info(`Generating dependencies for ${projectName}`);

  console.info(`Generating dependency graph`);
  const graph = await createProjectGraphAsync();
  const dependencies = getDependencies(graph, projectName);

  if (update) {
    console.info(`Updating file...`);
    writeFileSync(
      `apps/${projectName}/dependencies.sh`,
      `DEPENDENCIES="${dependencies}"`
    );

    return { success: true };
  }

  console.log(dependencies);

  console.info(`Checking if dependencies match...`);
  const realDependencies = readFileSync(`apps/${projectName}/dependencies.sh`, {
    encoding: 'utf8',
    flag: 'r',
  }).match(/"([^"]+)"/)[1];
  console.log(realDependencies);

  if (dependencies !== realDependencies) {
    console.log(
      `Defined dependencies do not match with the current ones, please generate them with "npx nx deps ${projectName} --update"`
    );
    return { success: false };
  }

  console.log('Defined dependencies match with the current ones');
  return { success: true };
}
