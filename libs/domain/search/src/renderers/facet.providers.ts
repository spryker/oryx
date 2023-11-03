import { featureVersion } from '@spryker-oryx/utilities';
import { DefaultFacetComponentRegistryService } from './default-facet-component-registry.service';
import { FacetColorsMapping, colorsMap } from './facet-color-colors.mapping';
import { FacetComponentRegistryService } from './facet-component-registry.service';
import { FacetValueRenderer } from './renderer';
import {
  colorFacetRenderer,
  defaultFacetRenderer,
  priceFacetRenderer,
  ratingFacetRenderer,
} from './value-renderer';

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
      ...(featureVersion >= '1.2'
        ? {
            ...priceFacetRenderer,
            ...ratingFacetRenderer,
          }
        : {}),
    },
  },
  {
    provide: FacetColorsMapping,
    useValue: colorsMap,
  },
];
