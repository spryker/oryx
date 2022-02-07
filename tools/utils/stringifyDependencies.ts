import { ProjectGraphNode } from '@nrwl/devkit';
import { resolveLocationOf } from './resolveLocation';

export const stringifyDependencies = (
  dependencies: string[],
  nodes: Record<string, ProjectGraphNode<any>>
): string =>
  dependencies
    .reduce(
      (acc, item) => `${acc} ${resolveLocationOf(item, nodes)}/${item}/*`,
      ''
    )
    .trim();
