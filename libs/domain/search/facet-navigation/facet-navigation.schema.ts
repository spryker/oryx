import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { FormFieldType } from 'libs/platform/form/src';
import { SearchFacetNavigationComponent } from './facet-navigation.component';

export const searchFacetNavigationSchema: ContentComponentSchema<SearchFacetNavigationComponent> =
  {
    name: 'Facets Navigation',
    group: 'Search',
    icon: IconTypes.Filters,
    options: {
      expandedItemsCount: {
        type: FormFieldType.Number,
      },
      valueRenderLimit: {
        type: FormFieldType.Number,
      },
      minForSearch: {
        type: FormFieldType.Number,
      },
    },
  };
