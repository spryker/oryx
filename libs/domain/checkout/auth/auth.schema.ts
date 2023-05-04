import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { CheckoutAuthComponent } from './auth.component';

export const checkoutAuthComponentSchema: ContentComponentSchema<CheckoutAuthComponent> =
  {
    name: 'Checkout auth',
    group: 'Checkout',
    options: {
      enableGuestCheckout: {
        type: FormFieldType.Boolean,
      },
    },
  };
