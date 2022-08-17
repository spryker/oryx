import { AppFeature } from '@spryker-oryx/core';
import { addToCartComponent } from '../add-to-cart/src/component';
import { miniCartComponent } from '../mini-cart/src/component';
import { quantityInputComponent } from '../quantity-input/src/component';
import { CART_PROVIDERS } from './services';

export const cartFeature: AppFeature = {
  providers: CART_PROVIDERS,
  components: [addToCartComponent, miniCartComponent, quantityInputComponent],
};
