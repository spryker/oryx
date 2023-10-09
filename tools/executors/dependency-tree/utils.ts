import {
  ProjectGraph,
  ProjectGraphDependency,
  ProjectGraphNode,
} from '@nx/devkit';

const findDependencies = (
  dependencies: Record<string, ProjectGraphDependency[]>,
  project: string
): string[] => {
  const foundDependencies = { [project]: true };
  const iterable = dependencies[project];

  for (const dep of iterable) {
    const isExist = foundDependencies[dep.target];
    const isNpm = dep.target.match('^npm:.*$');
    const isSprykerOryx = dep.target === 'spryker-oryx';

    if (isNpm || isExist || isSprykerOryx) {
      continue;
    }

    foundDependencies[dep.target] = true;
    iterable.push(...dependencies[dep.target]);
  }

  return Object.keys(foundDependencies);
};

const stringifyDependencies = (
  dependencies: string[],
  nodes: Record<string, ProjectGraphNode<any>>
): string =>
  dependencies
    .map((item) => `${nodes[item].data.root}/*`)
    .sort()
    .reduce((acc, item) => `${acc} ${item}`, '')
    .trim();

export const getDependencies = (graph: ProjectGraph<any>, project: string) =>
  stringifyDependencies(
    findDependencies(graph.dependencies, project),
    graph.nodes
  );
