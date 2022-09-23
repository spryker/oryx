import { AppFeature } from '@spryker-oryx/core';
import { addToCartComponent } from '../add-to-cart/src/component';
import { cartEntriesComponent } from '../entries/src/component';
import { cartEntryComponents } from '../entry/src/component';
import { miniCartComponent } from '../mini-cart/src/component';
import { quantityInputComponent } from '../quantity-input/src/component';
import { cartTotalsComponent } from '../totals/src/totals.def';
import { cartProviders } from './services';

export const cartFeature: AppFeature = {
  providers: cartProviders,
  components: [
    addToCartComponent,
    miniCartComponent,
    quantityInputComponent,
    cartEntriesComponent,
    ...cartEntryComponents,
    cartTotalsComponent,
  ],
};
