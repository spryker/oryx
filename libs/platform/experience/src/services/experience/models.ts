import { CompositionProperties } from '../../models';

export enum DynamicVisibilityStates {
  None = 'none',
  Defer = 'defer',
  Visible = 'visible',
  Hidden = 'hidden'
};

export interface ComponentImage {
  src: string;
  alt?: string;
}

export interface ComponentData {
  items?: any;
}

export interface ComponentVisibility {
  hide?: boolean,
  token?: string,
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
  visibility?: ComponentVisibility;
}
