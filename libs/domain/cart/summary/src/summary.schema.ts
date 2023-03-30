import {
  ComponentGroup,
  ContentComponentSchema,
} from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { CartSummaryComponent } from './summary.component';

export const cartSummaryComponentSchema: ContentComponentSchema<CartSummaryComponent> =
  {
    name: 'Cart summary',
    group: ComponentGroup.Cart,
    icon: '<path d="M17.3333 18.3851C18.0693 18.3851 18.6667 18.971 18.6667 19.6929C18.6667 20.4148 18.0693 21 17.3333 21C16.5973 21 16 20.4148 16 19.6929C16 18.971 16.5973 18.3851 17.3333 18.3851ZM10 18.3851C10.736 18.3851 11.3333 18.971 11.3333 19.6929C11.3333 20.4148 10.736 21 10 21C9.264 21 8.66667 20.4148 8.66667 19.6929C8.66667 18.971 9.264 18.3851 10 18.3851ZM22 6.61559L18.7693 17.091L18.69 17.0707L18.6873 17.0779H8.66667L4.85133 5.30779H2V4H5.68733L9.55533 15.7688H17.836L20.1953 7.92272H8.41667L8 6.61559H21.3333H22Z" />',
    options: {
      maxVisibleQuantity: { type: FormFieldType.Number },
    },
  };
