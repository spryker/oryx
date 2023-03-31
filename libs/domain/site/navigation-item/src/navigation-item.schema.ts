import {
  ComponentGroup,
  ContentComponentSchema,
} from '@spryker-oryx/experience';
import { SiteNavigationItemComponent } from './navigation-item.component';

export const siteNavigationItemSchema: ContentComponentSchema<SiteNavigationItemComponent> =
  {
    name: 'Navigation item',
    group: ComponentGroup.Site,
  };
