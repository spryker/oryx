import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { CartHeadingComponent } from './heading.component';

export const cartHeadingComponentSchema: ContentComponentSchema<CartHeadingComponent> =
  {
    name: 'Cart heading',
    group: 'Cart',
    icon: IconTypes.Title,
  };
