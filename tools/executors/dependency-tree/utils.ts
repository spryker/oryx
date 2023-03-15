import {
  ProjectGraph,
  ProjectGraphDependency,
  ProjectGraphNode,
} from '@nrwl/devkit';

const findDependencies = (
  dependencies: Record<string, ProjectGraphDependency[]>,
  project: string
): string[] => {
  const temp = [project];

  for (const p of temp) {
    const deps = dependencies[p]
      .filter((dep) => dep.target.match('^((?!npm:).)*$'))
      .filter((dep) => !temp.includes(dep.target))
      .filter((dep) => dep.target !== 'spryker-oryx')
      .map((dep) => dep.target);

    temp.push(...deps);
  }

  return temp;
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
