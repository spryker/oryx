import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['oryx-product-title']: {
      tag: 'oryx-product-title',
    },
    ['product-images']: {
      tag: 'product-images',
    },
    ['oryx-product-price']: {
      tag: 'oryx-product-price',
    },
    ['oryx-product-description']: {
      tag: 'oryx-product-description',
    },
    ['oryx-product-average-rating']: {
      tag: 'oryx-product-average-rating',
    },
    ['oryx-product-media']: {
      tag: 'oryx-product-media',
    },
    ['oryx-product-id']: {
      tag: 'oryx-product-id',
    },
    ['oryx-product-labels']: {
      tag: 'oryx-product-labels',
    },
    ['oryx-product-card']: {
      tag: 'oryx-product-card',
    },
    ['oryx-product-attributes']: {
      tag: 'oryx-product-attributes',
    },
    ['oryx-product-list']: {
      tag: 'product-list',
    },
  },
};
