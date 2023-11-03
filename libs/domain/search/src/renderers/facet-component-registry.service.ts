import { Facet } from '@spryker-oryx/product';
import { SelectFacetEventDetail } from '@spryker-oryx/search';
import { TemplateResult } from 'lit';
import { FacetMappingOptions } from './renderer';

export interface FacetComponentRegistryService {
  renderFacetComponent(
    facet: Facet,
    options: FacetMappingOptions,
    selectListener: (e: CustomEvent<SelectFacetEventDetail>) => void
  ): TemplateResult;
}

export const FacetComponentRegistryService = 'oryx.FacetComponentRegistry';

declare global {
  interface InjectionTokensContractMap {
    [FacetComponentRegistryService]: FacetComponentRegistryService;
  }
}
