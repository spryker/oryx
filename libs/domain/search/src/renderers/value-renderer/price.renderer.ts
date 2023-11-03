import { Facet } from '@spryker-oryx/product';
import { SelectFacetEventDetail } from '@spryker-oryx/search';
import { TemplateResult, html } from 'lit';
import { FacetMappingOptions, FacetParams } from '../renderer';

export const priceFacetRenderer = {
  [`${FacetParams.Price}`]: {
    template: (
      facet: Facet,
      options: FacetMappingOptions,
      selectListener: (e: CustomEvent<SelectFacetEventDetail>) => void
    ): TemplateResult => {
      return html`<oryx-search-price-facet
        @oryx.select=${selectListener}
        .name=${facet.name}
        ?open=${options.open}
        ?disableClear="${!options.enableClear}"
      ></oryx-search-price-facet>`;
    },
  },
};
