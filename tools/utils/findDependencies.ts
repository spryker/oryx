import { ProjectGraphDependency } from '@nrwl/devkit';

const filterOutExternalDependencies = (
  dependencies: ProjectGraphDependency[]
) =>
  dependencies
    .filter((dep) => dep.target.match('^((?!npm:).)*$'))
    .map((dep) => dep.target);

export const findDependencies = (
  dependencies: Record<string, ProjectGraphDependency[]>,
  project: string
): string[] => {
  const deps = filterOutExternalDependencies(dependencies[project]);

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
