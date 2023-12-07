import { CompositionProperties } from './composition.model';

export interface ComponentImage {
  src: string;
  alt?: string;
}

export interface ComponentData {
  items?: unknown;
}

export interface Component<
  Options = CompositionProperties,
  Content = Record<string, unknown>
> {
  id: string;
  name?: string;
  type: string;
  ref?: string;
  meta?: {
    route?: string;
    title?: string;
    description?: string;
    follow?: boolean;
    index?: boolean;
    [key: string]: string | boolean | undefined;
  };
  components?: Component[];
  options?: Options;
  content?: {
    data: Content;
  };
}
