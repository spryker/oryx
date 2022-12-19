import {
  ProjectGraph,
  ProjectGraphDependency,
  ProjectGraphNode,
} from '@nrwl/devkit';

type Type = Exclude<ProjectGraphNode<any>['type'], 'npm'>;

const TypeLocationMap: Record<Type, string> = {
  app: 'apps',
  lib: 'libs',
  e2e: 'apps',
};

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
    .map((item) => `${TypeLocationMap[nodes[item].type]}/${item}/*`)
    .sort()
    .reduce((acc, item) => `${acc} ${item}`, '')
    .trim();

export const getDependencies = (graph: ProjectGraph<any>, project: string) =>
  stringifyDependencies(
    findDependencies(graph.dependencies, project),
    graph.nodes
  );
