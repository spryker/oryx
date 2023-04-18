import { ElementDefinition } from '../page-meta.model';

export interface ElementResolver extends Partial<ElementDefinition> {
  link?: string;
  style?: string;
  script?: string;
  title?: string;
  id?: string;
}

export const enum ResolverScore {
  NotUsed = -1,
  Fallback = 0,
  Default = 1,
}
