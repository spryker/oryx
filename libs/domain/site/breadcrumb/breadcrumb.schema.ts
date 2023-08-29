import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n, iconInjectable } from '@spryker-oryx/utilities';
import { SiteBreadcrumbComponent } from './breadcrumb.component';

const icons =
  iconInjectable
    .get()
    ?.getIcons()
    .sort()
    .map((i) => ({ value: i, text: i })) ?? [];

export const siteBreadcrumbSchema: ContentComponentSchema<SiteBreadcrumbComponent> =
  {
    name: 'Breadcrumb',
    group: 'Site',
    icon: IconTypes.Link,
    options: {
      divider: {
        type: FormFieldType.Select,
        options: [{ value: '', text: i18n('icon.without-icon') }, ...icons],
      },
    },
  };
