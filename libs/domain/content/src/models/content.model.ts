import { SemanticLinkType } from '@spryker-oryx/site';
import { ContentEntities } from '../services';

export interface ContentQualifier {
  type?: string;
  id?: string;
  entities?: ContentEntities;
}

export interface Content {
  id?: string;
  type?: SemanticLinkType;
  heading: string;
  description: string;
  content: string;
}
