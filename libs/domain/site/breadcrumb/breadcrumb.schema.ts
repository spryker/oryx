import { ContentComponentSchema } from '@spryker-oryx/experience';
import { SiteBreadcrumbComponent } from './breadcrumb.component';

export const siteBreadcrumbSchema: ContentComponentSchema<SiteBreadcrumbComponent> =
  {
    name: 'Breadcrumb',
    group: 'Site',
  };
