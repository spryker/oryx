import { ContentFields } from '../services';

export interface ContentQualifier {
  article?: string;
  entities?: (string | ContentFields)[];
}

export interface Content {
  article?: string;
}
