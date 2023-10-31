import {
  CarouselIndicatorAlignment,
  CarouselIndicatorPosition,
  ContentComponentSchema,
} from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';

export const schema: ContentComponentSchema = {
  name: 'carousel',
  group: 'layout',
  options: {
    showArrow: { type: FormFieldType.Boolean },
    showIndicators: { type: FormFieldType.Boolean },
    indicatorsPosition: {
      type: FormFieldType.Select,
      options: [
        { value: CarouselIndicatorPosition.Below },
        { value: CarouselIndicatorPosition.Bottom },
      ],
    },
    indicatorsAlignment: {
      type: FormFieldType.Select,
      options: [
        { value: CarouselIndicatorAlignment.Start },
        { value: CarouselIndicatorAlignment.Center },
        { value: CarouselIndicatorAlignment.End },
      ],
    },
    navigatePerItem: { type: FormFieldType.Boolean },
  },
};
