import { ContentEntities } from '../services';
import { RouteLinkType } from '@spryker-oryx/router/lit';

export interface ContentQualifier {
  type?: string;
  id?: string;
  entities?: ContentEntities;
}

export interface Content {
  id?: string;
  type?: RouteLinkType;
  url?: string;
  heading: string;
  description: string;
  content: string;
}
