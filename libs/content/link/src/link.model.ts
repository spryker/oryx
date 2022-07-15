import { SemanticLinkType } from '@spryker-oryx/site';

export const enum LinkType {
  RawUrl = 'rawUrl',
}

export interface LinkOptions {
  type?: SemanticLinkType | LinkType;
  text?: string;
  id?: string;
  icon?: string;
  label?: string;
  target?: string;
  noopener?: boolean;
  nofollow?: boolean;
}
