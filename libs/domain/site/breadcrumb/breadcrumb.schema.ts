import { ContentComponentSchema } from '@spryker-oryx/experience';
import { SiteBreadcrumbComponent } from './breadcrumb.component';
import { FormFieldType } from '@spryker-oryx/form';
import { i18n, iconInjectable } from '@spryker-oryx/utilities';
import { IconTypes } from '@spryker-oryx/ui/icon';

const icons = iconInjectable.get()?.getIcons().sort()
  .map((i) => ({ value: i, text: i })) ?? []

export const siteBreadcrumbSchema: ContentComponentSchema<SiteBreadcrumbComponent> =
  {
    name: 'Breadcrumb',
    group: 'Site',
    icon: IconTypes.Link,
    options: {
      divider: {
        type: FormFieldType.Select,
        options: [ { value: '', text: i18n('icon.without-icon')}, ...icons ],
      },
    },
  };
