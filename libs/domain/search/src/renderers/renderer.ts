import { Facet } from '@spryker-oryx/product';
import { FacetSelect } from '@spryker-oryx/search/facet';
import { TemplateResult } from 'lit';

export const FacetValueRenderer = 'oryx.FacetValueRenderer*';

export enum FacetParams {
  Default = 'default',
  Color = 'color',
}

export interface FacetMappingOptions {
  renderLimit: number;
  open: boolean;
  minForSearch: number;
  enableClearAction?: boolean;
}

export interface FacetRendererMapping {
  [key: string]: {
    template: (
      facet: Facet,
      options: FacetMappingOptions,
      selectListener: (e: CustomEvent<FacetSelect>) => void
    ) => TemplateResult;
  };
}

declare global {
  interface InjectionTokensContractMap {
    [FacetValueRenderer]: FacetRendererMapping[];
  }
}
