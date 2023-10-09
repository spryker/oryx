import { DefaultFacetComponentRegistryService } from './default-facet-component-registry.service';
import { FacetColorsMapping, colorsMap } from './facet-color-colors.mapping';
import { FacetComponentRegistryService } from './facet-component-registry.service';
import { FacetValueRenderer } from './renderer';
import { colorFacetRenderer, defaultFacetRenderer } from './value-renderer';

export const facetProviders = [
  {
    provide: FacetComponentRegistryService,
    useClass: DefaultFacetComponentRegistryService,
  },
  {
    provide: FacetValueRenderer,
    useValue: {
      ...defaultFacetRenderer,
      ...colorFacetRenderer,
    },
  },
  {
    provide: FacetColorsMapping,
    useValue: colorsMap,
  },
];
