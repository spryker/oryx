import { Facet } from '@spryker-oryx/product';
import { SelectFacetEventDetail } from '@spryker-oryx/search/facet';
import { TemplateResult, html } from 'lit';
import { FacetMappingOptions, FacetParams } from '../renderer';
import { CurrencyService } from '@spryker-oryx/site';
import { resolve } from '@spryker-oryx/di';
import { effect, i18n, signal } from '@spryker-oryx/utilities';
import { DirectiveResult } from 'lit/directive';
import { keyed } from 'lit/directives/keyed.js';

export const priceFacetRenderer = {
  [`${FacetParams.Price}`]: {
    template: (
      facet: Facet,
      options: FacetMappingOptions,
      selectListener: (e: CustomEvent<SelectFacetEventDetail>) => void
    ): DirectiveResult => {
      const $currency = signal(resolve(CurrencyService).getCurrencySymbol());
      const labelMin = i18n('price.label.min-<currency>', {currency: $currency()});
      const labelMax = i18n('price.label.max-<currency>', {currency: $currency()});

      return keyed(
        facet.name,
        html` <oryx-search-range-facet
          @oryx.select=${selectListener}
          .name=${facet.name}
          ?open=${options.open}
          ?disableClear="${!options.enableClear}"
          .labelMin=${labelMin}
          .labelMax=${labelMax}
        ></oryx-search-range-facet>`
      );
    },
  },
};
