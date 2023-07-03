import { ContentEntities } from '../services';

export interface ContentQualifier {
  type?: string;
  id?: string;
  entities?: ContentEntities;
}

export interface Content {
  heading: string;
  description: string;
  content: string;
}
