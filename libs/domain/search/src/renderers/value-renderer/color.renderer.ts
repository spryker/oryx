import { FacetType, ValueFacet } from '@spryker-oryx/product';
import { SelectFacetEventDetail } from '@spryker-oryx/search/facet';
import { TemplateResult, html } from 'lit';
import { FacetMappingOptions, FacetParams } from '../renderer';

export const colorFacetRenderer = {
  [`${FacetParams.Color}`]: {
    template: (
      facet: ValueFacet,
      options: FacetMappingOptions,
      selectListener: (e: CustomEvent<SelectFacetEventDetail>) => void
    ): TemplateResult => {
      return html`
        <oryx-search-color-facet
          @oryx.select=${selectListener}
          .name=${facet.name}
          .renderLimit=${options.renderLimit}
          .open=${options.open}
          .multi=${facet.type === FacetType.Multi}
        >
        </oryx-search-color-facet>
      `;
    },
  },
};
