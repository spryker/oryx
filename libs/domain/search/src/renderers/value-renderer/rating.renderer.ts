import { FacetType, ValueFacet } from '@spryker-oryx/product';
import { SelectFacetEventDetail } from '@spryker-oryx/search/facet';
import { TemplateResult, html } from 'lit';
import { FacetMappingOptions, FacetParams } from '../renderer';

export const ratingFacetRenderer = {
  [`${FacetParams.Rating}`]: {
    template: (
      facet: ValueFacet,
      options: FacetMappingOptions,
      selectListener: (e: CustomEvent<SelectFacetEventDetail>) => void
    ): TemplateResult => {
      return html`
        <oryx-search-facet-rating
          @oryx.select=${selectListener}
          .name=${facet.name}
          .renderLimit=${options.renderLimit}
          .open=${options.open}
          ?disableClear="${!options.enableClear}"
          .multi=${facet.type === FacetType.Multi}
        >
        </oryx-search-facet-rating>
      `;
    },
  },
};
