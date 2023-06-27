import { ContentFields } from '../services';

export interface ContentQualifier {
  article?: string;
  entries?: (string | ContentFields)[];
}

export interface Content {
  article?: string;
}
