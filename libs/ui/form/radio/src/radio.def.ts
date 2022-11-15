import { componentDef } from '@spryker-oryx/core';

export const radioComponent = componentDef({
  name: 'oryx-radio',
  impl: () => import('./radio.component').then((m) => m.RadioComponent),
  stylesheets: [
    {
      rules: () => import('./radio.styles').then((m) => m.screenStyles),
    },
  ],
});
