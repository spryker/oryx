import { ProjectGraphNode } from '@nrwl/devkit';

export type Type = Exclude<ProjectGraphNode<any>['type'], 'npm'>;
export const TypeLocationMap: Record<Type, string> = {
  app: 'apps',
  lib: 'libs',
  e2e: 'apps',
};

export const resolveLocationOf = (
  project: string,
  nodes: Record<string, ProjectGraphNode<any>>
): string => TypeLocationMap[nodes[project].type];
