import { ContentQualifier } from '../models';

declare global {
  interface ContextValue {
    [ContentContext.Qualifier]?: ContentQualifier;
  }
}

export const enum ContentContext {
  Qualifier = 'content-qualifier',
}
