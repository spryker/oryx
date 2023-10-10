import { Facet, FacetType } from '@spryker-oryx/product';
import { SelectFacetEventDetail } from '@spryker-oryx/search/facet';
import { TemplateResult, html } from 'lit';
import { FacetMappingOptions, FacetParams } from '../renderer';

export const defaultFacetRenderer = {
  [`${FacetParams.Default}`]: {
    template: (
      facet: Facet,
      options: FacetMappingOptions,
      selectListener: (e: CustomEvent<SelectFacetEventDetail>) => void
    ): TemplateResult => {
      if (facet.type === FacetType.Range) {
        return html` <oryx-search-range-facet
          @oryx.select=${selectListener}
          .name=${facet.name}
          ?open=${options.open}
          ?disableClear="${!options.enableClear}"
        ></oryx-search-range-facet>`;
      }

      return html`
        <oryx-search-facet
          @oryx.select=${selectListener}
          .name=${facet.name}
          .renderLimit=${options.renderLimit}
          .open=${options.open}
          ?disableClear="${!options.enableClear}"
          .multi=${facet.type === FacetType.Multi}
        >
        </oryx-search-facet>
      `;
    },
  },
};
