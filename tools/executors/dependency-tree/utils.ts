import {
  ProjectGraph,
  ProjectGraphDependency,
  ProjectGraphNode,
} from '@nrwl/devkit';

const findDependencies = (
  dependencies: Record<string, ProjectGraphDependency[]>,
  project: string
): string[] => {
  // filter out external dependencies
  const deps = dependencies[project]
    .filter((dep) => dep.target.match('^((?!npm:).)*$'))
    .map((dep) => dep.target);

  return [
    ...new Set<string>([
      project,
      ...deps.reduce(
        (acc, dep) => [...acc, ...findDependencies(dependencies, dep)],
        []
      ),
    ]),
  ];
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
