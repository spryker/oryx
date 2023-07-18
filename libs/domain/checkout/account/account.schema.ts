import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { CheckoutAccountComponent } from './account.component';

export const checkoutAccountComponentSchema: ContentComponentSchema<CheckoutAccountComponent> =
  {
    name: 'Checkout account',
    group: 'Checkout',
    options: {
      enableGuestCheckout: {
        type: FormFieldType.Boolean,
      },
    },
  };
