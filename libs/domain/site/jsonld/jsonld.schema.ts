import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { SiteJsonLdComponent } from './jsonld.component';

export const siteJsonLdSchema: ContentComponentSchema<SiteJsonLdComponent> = {
  name: 'Json LD (structured data)',
  group: 'Site',
  icon: 'schema',
  options: {
    serverOnly: {
      type: FormFieldType.Boolean,
    },
  },
};
