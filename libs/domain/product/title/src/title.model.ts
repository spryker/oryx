import { HeadingAttributes } from '@spryker-oryx/ui/heading';
import { LinkType } from '@spryker-oryx/ui/link';

export interface ProductTitleOptions extends HeadingAttributes {
  linkType?: 'none' | LinkType;
}
