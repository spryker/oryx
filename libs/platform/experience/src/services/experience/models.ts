import { CompositionProperties } from '../../models';

export const enum Visibility {
  None = 'none',
  Visible = 'visible',
  Hidden = 'hidden',
}

export interface ComponentImage {
  src: string;
  alt?: string;
}

export interface ComponentData {
  items?: any;
}

export interface Component<C = CompositionProperties> {
  id: string;
  name?: string;
  type: string;
  meta?: {
    route?: string;
    title?: string;
    description?: string;
    follow?: boolean;
    index?: boolean;
    [key: string]: any;
  };
  components?: Component[];
  options?: { data?: C };
  content?: { data?: any };
}
