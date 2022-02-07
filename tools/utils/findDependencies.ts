import { ProjectGraphDependency } from '@nrwl/devkit';

export const findDependencies = (
  dependencies: Record<string, ProjectGraphDependency[]>,
  project: string
): string[] => {
  const deps = dependencies[project]
    .filter((dep) => dep.target.match('^((?!npm:).)*$'))
    .map((dep) => dep.target);

  if (deps.length > 0) {
    return [
      project,
      ...deps.reduce(
        (acc, dep) => [...acc, ...findDependencies(dependencies, dep)],
        []
      ),
    ];
  }

  return [project];
};
