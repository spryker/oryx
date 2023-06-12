import { Facet } from '@spryker-oryx/product';
import { SelectFacetPayload } from '@spryker-oryx/search/facet';
import { TemplateResult } from 'lit';
import { FacetMappingOptions } from './renderer';

export interface FacetComponentRegistryService {
  renderFacetComponent(
    facet: Facet,
    options: FacetMappingOptions,
    selectListener: (e: CustomEvent<SelectFacetPayload>) => void
  ): TemplateResult;
}

export const FacetComponentRegistryService = 'oryx.FacetComponentRegistry';

declare global {
  interface InjectionTokensContractMap {
    [FacetComponentRegistryService]: FacetComponentRegistryService;
  }
}
