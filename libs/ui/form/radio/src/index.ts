import { componentDef } from '@spryker-oryx/core';

export * from './radio.component';
export * from './radio.styles';

export const radioComponent = componentDef({
  name: 'oryx-radio',
  impl: () => import('./radio.component').then((m) => m.RadioComponent),
});
