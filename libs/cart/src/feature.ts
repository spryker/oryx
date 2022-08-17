import { AppFeature } from '@spryker-oryx/core';
import { addToCartComponent } from '../add-to-cart/src/component';
import { miniCartComponent } from '../mini-cart/src/component';
import { quantityInputComponent } from '../quantity-input/src/component';
import { cartProviders } from './services';

export const cartFeature: AppFeature = {
  providers: cartProviders,
  components: [addToCartComponent, miniCartComponent, quantityInputComponent],
};
