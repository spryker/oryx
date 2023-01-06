import { Facet } from '@spryker-oryx/product';
import { FacetSelect } from '@spryker-oryx/search/facet';
import { html, TemplateResult } from 'lit';
import { DefaultFacetComponentRegistryService } from './default-facet-component-registry.service';
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
          selectListener: (e: CustomEvent<FacetSelect>) => void
        ): TemplateResult => {
          return html`
            <oryx-search-facet
              @oryx.select=${selectListener}
              .name=${facet.name}
              .renderLimit=${options.renderLimit}
              .open=${options.open}
              .multi=${facet.multiValued}
            >
            </oryx-search-facet>
          `;
        },
      },
    },
  },
];
