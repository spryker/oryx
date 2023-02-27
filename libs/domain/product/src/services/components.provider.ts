import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['oryx-product-title']: {},
    ['oryx-product-images']: {},
    ['oryx-product-price']: {},
    ['oryx-product-description']: {},
    ['oryx-product-average-rating']: {},
    ['oryx-product-media']: {},
    ['oryx-product-id']: {},
    ['oryx-product-labels']: {},
    ['oryx-product-card']: {},
    ['oryx-product-attributes']: {},
    ['oryx-product-list']: {},
  },
};
