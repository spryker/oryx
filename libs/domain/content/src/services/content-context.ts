import { ContentQualifier } from '../models';

declare global {
  interface ContextValue {
    [ContentContext.Content]?: ContentQualifier;
  }
}

export const enum ContentContext {
  /**
   * @deprecated Since version 1.4. Use ContentContext.Content instead.
   */
  Qualifier = 'content-qualifier',
  Content = 'content',
}
