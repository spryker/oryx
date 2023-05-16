import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { SearchFacetNavigationComponent } from './facet-navigation.component';

export const searchFacetNavigationSchema: ContentComponentSchema<SearchFacetNavigationComponent> =
  {
    name: 'Facets Navigation',
    group: 'Search',
    icon: IconTypes.Filters,
    options: {
      expandedItemsCount: {
        label: 'Expanded items count',
        type: FormFieldType.Number,
      },
      valueRenderLimit: {
        label: 'Maximum values for render',
        type: FormFieldType.Number,
      },
      minForSearch: {
        label: 'Minimum values to enable search',
        type: FormFieldType.Number,
      },
    },
  };
