import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { ProductAverageRatingComponent } from './average-rating.component';

export const productAverageRatingSchema: ContentComponentSchema<ProductAverageRatingComponent> =
  {
    name: 'Product Average Rating',
    group: 'Product',
    icon: IconTypes.Star,
    options: {
      enableCount: { type: FormFieldType.Boolean, width: 100 },
      size: {
        type: FormFieldType.Select,
        options: [{ value: Size.Sm }, { value: Size.Lg }],
      },
    },
  };
