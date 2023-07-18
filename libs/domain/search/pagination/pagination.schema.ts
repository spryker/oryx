import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { SearchPaginationComponent } from './pagination.component';

export const searchPaginationComponentSchema: ContentComponentSchema<SearchPaginationComponent> =
  {
    name: 'Pagination',
    group: 'Search',
    icon: IconTypes.ArrowsOutward,
    options: {
      max: {
        type: FormFieldType.Number,
        label: 'Max number of visible pages',
        width: 100,
      },
      enableControls: {
        type: FormFieldType.Boolean,
      },
    },
  };
