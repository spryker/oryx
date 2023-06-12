import { ContentComponentSchema } from '@spryker-oryx/experience';
import { CheckoutShippingAddressComponent } from './shipping-address.component';

export const checkoutShippingAddressSchema: ContentComponentSchema<CheckoutShippingAddressComponent> =
  {
    name: 'Checkout Shipping Address',
    group: 'Checkout',
  };
