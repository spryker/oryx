import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { SearchRatingFacetComponent } from './facet-rating.component';

export const facetRatingComponentSchema: ContentComponentSchema<SearchRatingFacetComponent> =
  {
    name: 'Site search',
    group: 'Search',
    icon: IconTypes.Search,
    options: {
      min: {
        type: FormFieldType.Number,
        min: 1,
      },
      max: {
        type: FormFieldType.Number,
      },
      scale: {
        type: FormFieldType.Number,
      },
    },
  };
