import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { SortParamNames } from '@spryker-oryx/product';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductListComponent } from './list.component';

export const productListSchema: ContentComponentSchema<ProductListComponent> = {
  name: 'Product List',
  group: 'Product',
  icon: IconTypes.ViewList,
  options: {
    q: { type: FormFieldType.Text, label: 'Search query', width: 100 },
    category: { type: FormFieldType.Text },
    brand: { type: FormFieldType.Text },

    minPrice: { type: FormFieldType.Number },
    maxPrice: { type: FormFieldType.Number },

    minRating: { type: FormFieldType.Number },
    weight: { type: FormFieldType.Text },
    color: { type: FormFieldType.Text },

    sort: {
      type: FormFieldType.Select,
      options: [
        { value: SortParamNames.NameAsc },
        { value: SortParamNames.NameDesc },
        { value: SortParamNames.None },
        { value: SortParamNames.Popularity },
        { value: SortParamNames.PriceAsc },
        { value: SortParamNames.PriceDesc },
        { value: SortParamNames.Rating },
      ],
    },
    page: { type: FormFieldType.Number },
    ipp: {
      type: FormFieldType.Select,
      options: [{ value: '12' }, { value: '24' }, { value: '36' }],
      label: 'Items per page',
    },
  },
};
