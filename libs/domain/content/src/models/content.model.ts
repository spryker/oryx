import { ContentEntities } from '../services';

export interface ContentQualifier {
  article?: string;
  entities?: ContentEntities;
}

export interface Content {
  article?: string;
}
