import { ContentEntities } from '../services';
import { RouteType } from '@spryker-oryx/router';

export interface ContentQualifier {
  type?: string;
  id?: string;
  entities?: ContentEntities;
}

export interface Content {
  id?: string;
  type?: RouteType;
  url?: string;
  heading: string;
  description: string;
  content: string;
}
