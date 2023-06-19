import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { SearchBoxComponent } from './box.component';

export const searchBoxComponentSchema: ContentComponentSchema<SearchBoxComponent> =
  {
    name: 'Site search',
    group: 'Search',
    icon: IconTypes.Search,
    options: {
      minChars: {
        type: FormFieldType.Number,
        min: 0,
      },
      completionsCount: {
        type: FormFieldType.Number,
        min: 0,
      },
      productsCount: {
        type: FormFieldType.Number,
        min: 0,
      },
      categoriesCount: {
        type: FormFieldType.Number,
        min: 0,
      },
      cmsCount: {
        type: FormFieldType.Number,
        min: 0,
      },
    },
  };
