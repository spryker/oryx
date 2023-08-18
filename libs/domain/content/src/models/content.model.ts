import { RouteType } from '@spryker-oryx/router';
import { ContentEntities } from '../services';

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
