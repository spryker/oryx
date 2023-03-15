import {
  ProjectGraph,
  ProjectGraphDependency,
  ProjectGraphNode,
} from '@nrwl/devkit';

const findDependencies = (
  dependencies: Record<string, ProjectGraphDependency[]>,
  project: string
): string[] => {
  const temp = { [project]: true };
  const iterable = dependencies[project];

  for (const dep of iterable) {
    const isExist = temp[dep.target];
    const isNpm = dep.target.match('^npm:.*$');
    const isSprykerOryx = dep.target === 'spryker-oryx';

    if (isNpm || isExist || isSprykerOryx) {
      continue;
    }

    temp[dep.target] = true;
    iterable.push(...dependencies[dep.target]);
  }

  return Object.keys(temp);
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
