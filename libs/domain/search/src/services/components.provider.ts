import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['search-box']: {},
    ['search-facet-navigation']: {},
    ['oryx-search-pagination']: {},
    ['search-product-sort']: {},
  },
};
