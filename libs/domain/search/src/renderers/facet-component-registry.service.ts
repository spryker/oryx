import { Facet } from '@spryker-oryx/product';
import { SelectFacetEventDetail } from '@spryker-oryx/search/facet';
import { TemplateResult } from 'lit';
import { FacetMappingOptions, RatingFacetMappingOptions } from './renderer';

export interface FacetComponentRegistryService {
  renderFacetComponent(
    facet: Facet,
    options: FacetMappingOptions | RatingFacetMappingOptions,
    selectListener: (e: CustomEvent<SelectFacetEventDetail>) => void
  ): TemplateResult;
}

export const FacetComponentRegistryService = 'oryx.FacetComponentRegistry';

declare global {
  interface InjectionTokensContractMap {
    [FacetComponentRegistryService]: FacetComponentRegistryService;
  }
}
