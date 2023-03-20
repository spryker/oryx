import { CompositionProperties } from '../../models';

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
    [key: string]: any;
  };
  components?: Component[];
  options?: { data?: C };
  content?: { data?: any };
}
