import { ValueFacet } from '@spryker-oryx/product';
import { SelectFacetEventDetail } from '@spryker-oryx/search/facet';
import { TemplateResult, html } from 'lit';
import { DefaultFacetComponentRegistryService } from './default-facet-component-registry.service';
import { FacetColorsMapping, colorsMap } from './facet-color-colors.mapping';
import { FacetComponentRegistryService } from './facet-component-registry.service';
import {
  FacetMappingOptions,
  FacetParams,
  FacetValueRenderer,
} from './renderer';

export const facetProviders = [
  {
    provide: FacetComponentRegistryService,
    useClass: DefaultFacetComponentRegistryService,
  },
  {
    provide: FacetValueRenderer,
    useValue: {
      [`${FacetParams.Default}`]: {
        template: (
          facet: ValueFacet,
          options: FacetMappingOptions,
          selectListener: (e: CustomEvent<SelectFacetEventDetail>) => void
        ): TemplateResult => {
          return html`
            <oryx-search-facet
              @oryx.select=${selectListener}
              .name=${facet.name}
              .renderLimit=${options.renderLimit}
              .open=${options.open}
              .enableClear="${options.enableClear}"
              .multi=${facet.multiValued}
            >
            </oryx-search-facet>
          `;
        },
      },
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
              .multi=${facet.multiValued}
            >
            </oryx-search-color-facet>
          `;
        },
      },
    },
  },
  {
    provide: FacetColorsMapping,
    useValue: colorsMap,
  },
];
