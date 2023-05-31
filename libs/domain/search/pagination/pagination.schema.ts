import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { PaginationComponent } from './pagination.component';

export const paginationComponentSchema: ContentComponentSchema<PaginationComponent> =
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
