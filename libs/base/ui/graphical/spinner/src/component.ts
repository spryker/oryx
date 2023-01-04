import { componentDef } from '@spryker-oryx/core';

export const spinnerComponent = componentDef({
  name: 'oryx-spinner',
  impl: () => import('./spinner.component').then((m) => m.SpinnerComponent),
});
