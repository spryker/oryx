import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from 'libs/platform/form/src';
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
