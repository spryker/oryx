import { createProjectGraphAsync } from '@nrwl/workspace/src/core/project-graph';
import { readFileSync } from 'fs';
import { findDependencies, stringifyDependencies } from '../../utils';

export interface EchoExecutorOptions {
  project: string;
}

export default async function echoExecutor(options: EchoExecutorOptions) {
  console.info(`Generating dependencies for ${options.project}`);

  console.info(`Generating dependency graph`);
  const graph = await createProjectGraphAsync();

  const dependencies = stringifyDependencies(
    findDependencies(graph.dependencies, options.project),
    graph.nodes
  );

  console.log(dependencies);

  console.info(`Checking if dependencies match...`);
  const realDependencies = readFileSync(
    `apps/${options.project}/dependencies.sh`,
    {
      encoding: 'utf8',
      flag: 'r',
    }
  ).match(/"([^"]+)"/)[1];
  console.log(realDependencies);

  if (dependencies !== realDependencies) {
    console.log(
      'Defined dependencies do not match with the current ones, please generate them with "npx nx affected --target=generate-dep-tree"'
    );
    return { success: false };
  }

  console.log('Defined dependencies match with the current ones');
  return { success: true };
}
