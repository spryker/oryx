export interface ComponentImage {
  src: string;
  alt?: string;
}

export interface ComponentData {
  items?: any;
}

export interface Component<C = any> {
  id: string;
  name?: string;
  type: string;
  meta?: {
    route?: string;
    title?: string;
    [key: string]: any;
  };
  components?: Component<any>[];
  options?: { data?: C };
  content?: { data?: any };
}
