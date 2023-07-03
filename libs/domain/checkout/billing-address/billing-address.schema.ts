import { ContentComponentSchema } from '@spryker-oryx/experience';
import { CheckoutBillingAddressComponent } from './billing-address.component';

export const checkoutBillingAddressSchema: ContentComponentSchema<CheckoutBillingAddressComponent> =
  {
    name: 'Checkout Billing Address',
    group: 'Checkout',
  };
