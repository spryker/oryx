import { componentDef } from '@spryker-oryx/core';
import { cartEntryConfirmationScreenStyles } from './confirmation.styles';

export const cartEntryConfirmationComponent = componentDef({
  name: 'cart-entry-confirmation',
  impl: () =>
    import('./confirmation.component').then(
      (m) => m.CartEntryConfirmationComponent
    ),
  screenStyles: cartEntryConfirmationScreenStyles,
});
