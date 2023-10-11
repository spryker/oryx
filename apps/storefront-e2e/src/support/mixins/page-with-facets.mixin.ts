import { FacetsFragment } from '../page-fragments/facets.fragment';
import { E2EPage } from '../page-objects/abstract.page';
import { Constructor } from '../types/utils.types';

export interface IPageWithFacets {
  getFacets(): FacetsFragment;
}

export function WithFacets<TPage extends Constructor<E2EPage>>(Page: TPage) {
  return class PageWithFacets extends Page implements IPageWithFacets {
    constructor(...args: any[]) {
      super(...args);
    }

    getFacets = () => new FacetsFragment();
  };
}
