import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { FormFieldType } from 'libs/platform/form/src';
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
