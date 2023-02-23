import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { SearchBoxComponent } from './box.component';

export const searchBoxComponentSchema: ContentComponentSchema<SearchBoxComponent> =
  {
    name: 'Site search',
    group: 'Search',
    icon: '<path d="M15.3532 4.04294C18.521 6.87982 18.9198 11.6977 16.2615 15.0168L22 20.7553L20.7553 22L15.0168 16.2615C11.6977 18.9198 6.87982 18.521 4.04294 15.3532C1.20605 12.1854 1.3391 7.3529 4.346 4.346C7.3529 1.3391 12.1854 1.20605 15.3532 4.04294ZM10.0218 3.79027C6.5847 3.79027 3.79835 6.57662 3.79835 10.0138C3.79835 13.4509 6.5847 16.2372 10.0218 16.2372C13.459 16.2372 16.2453 13.4509 16.2453 10.0138C16.2409 6.57846 13.4571 3.79472 10.0218 3.79027Z" />',
    options: {
      minChars: {
        label: 'Min query length',
        type: FormFieldType.Number,
        min: 0,
      },
      completionsCount: {
        label: 'Max completions to show',
        type: FormFieldType.Number,
        min: 0,
      },
      productsCount: {
        label: 'Max products to show',
        type: FormFieldType.Number,
        min: 0,
      },
      categoriesCount: {
        label: 'Max categories to show',
        type: FormFieldType.Number,
        min: 0,
      },
      cmsCount: {
        label: 'Max CMS links to show',
        type: FormFieldType.Number,
        min: 0,
      },
    },
  };
