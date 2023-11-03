import { ValueFacet } from '@spryker-oryx/product';
import { SelectFacetEventDetail } from '@spryker-oryx/search';
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
          .open=${options.open}
          ?disableClear="${!options.enableClear}"
          min="1"
          max="4"
        ></oryx-search-facet-rating>
      `;
    },
  },
};
