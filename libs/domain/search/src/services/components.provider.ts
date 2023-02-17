import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['search-box']: {
      tag: 'search-box',
    },
    ['search-facet-navigation']: {
      tag: 'search-facet-navigation',
    },
    ['oryx-search-pagination']: {
      tag: 'oryx-search-pagination',
    },
    ['search-product-sort']: {
      tag: 'search-product-sort',
    },
  },
};
