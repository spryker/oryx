import { componentDef } from '@spryker-oryx/core';

export * from './spinner.component';
export * from './spinner.model';
export * from './spinner.styles';

export const spinnerComponent = componentDef({
  name: 'oryx-spinner',
  impl: () => import('./spinner.component').then((m) => m.SpinnerComponent),
});
