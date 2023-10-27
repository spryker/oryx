import { Facet, FacetType, ValueFacet } from '@spryker-oryx/product';
import { SelectFacetEventDetail } from '@spryker-oryx/search/facet';
import { featureVersion } from '@spryker-oryx/utilities';
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
          facet: Facet,
          options: FacetMappingOptions,
          selectListener: (e: CustomEvent<SelectFacetEventDetail>) => void
        ): TemplateResult => {
          if (featureVersion >= '1.2' && facet.type === FacetType.Range) {
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
              .multi=${facet.type === FacetType.Multi}
            >
            </oryx-search-facet-rating>
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
