import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { CheckoutCustomerComponent } from './customer.component';

export const checkoutCustomerComponentSchema: ContentComponentSchema<CheckoutCustomerComponent> =
  {
    name: 'Checkout customer',
    group: 'Checkout',
    options: {
      enableGuestCheckout: {
        type: FormFieldType.Boolean,
      },
    },
  };
