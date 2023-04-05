import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { SortParamNames } from '../../src/models';
import { ProductListComponent } from './list.component';

export const productListSchema: ContentComponentSchema<ProductListComponent> = {
  name: 'Product list',
  group: 'Product',
  icon: '<path d="M14 13C13.4477 13 13 13.4477 13 14V14C13 14.5523 13.4477 15 14 15H20C20.5523 15 21 14.5523 21 14V14C21 13.4477 20.5523 13 20 13H14ZM14 19C13.4477 19 13 19.4477 13 20V20C13 20.5523 13.4477 21 14 21H20C20.5523 21 21 20.5523 21 20V20C21 19.4477 20.5523 19 20 19H14ZM14 8C13.4477 8 13 8.44772 13 9V9C13 9.55228 13.4477 10 14 10H20C20.5523 10 21 9.55228 21 9V9C21 8.44772 20.5523 8 20 8H14ZM14 3C13.4477 3 13 3.44772 13 4V4C13 4.55228 13.4477 5 14 5H20C20.5523 5 21 4.55228 21 4V4C21 3.44772 20.5523 3 20 3H14Z" /><path d="M11 19.8C11 20.12 10.8726 20.4 10.6179 20.64C10.3632 20.88 10.066 21 9.72637 21L4.27363 21C3.934 21 3.63682 20.88 3.38209 20.64C3.12736 20.4 3 20.12 3 19.8L3 4.2C3 3.88 3.12736 3.6 3.38209 3.36C3.63682 3.12 3.934 3 4.27363 3H9.72637C10.066 3 10.3632 3.12 10.6179 3.36C10.8726 3.6 11 3.88 11 4.2L11 19.8ZM9.12935 19.2V4.8H4.75124L4.75124 19.2H9.12935Z"/>',
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
