import { Facet } from '@spryker-oryx/product';
import { FacetSelect } from '@spryker-oryx/search/facet';
import { TemplateResult } from 'lit';
import { FacetMappingOptions } from './renderer';

export interface FacetComponentRegistryService {
  renderFacetComponent(
    facet: Facet,
    options: FacetMappingOptions,
    selectListener: (e: CustomEvent<FacetSelect>) => void
  ): TemplateResult;
}

export const FacetComponentRegistryService = 'oryx.FacetComponentRegistry';

declare global {
  interface InjectionTokensContractMap {
    [FacetComponentRegistryService]: FacetComponentRegistryService;
  }
}
