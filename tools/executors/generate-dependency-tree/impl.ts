import { createProjectGraphAsync } from '@nrwl/workspace/src/core/project-graph';
import { writeFileSync } from 'fs';
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

  console.info(`Updating file...`);
  writeFileSync(
    `apps/${options.project}/dependencies.sh`,
    `DEPENDENCIES="${dependencies}"`
  );

  return { success: true };
}
