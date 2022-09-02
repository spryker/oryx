export interface ComponentImage {
  src: string;
  alt?: string;
}

export interface ComponentData {
  items?: any;
}

export interface Component {
  id?: string;
  type: string;
  components?: Component[];
  options?: {
    data?: any;
  };
  content?: {
    data?: any;
  };
}

export interface ComponentLayout {
  classes?: string;
  styles?: string;
}
