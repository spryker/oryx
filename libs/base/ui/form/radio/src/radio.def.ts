import { componentDef } from '@spryker-oryx/utilities';

export const radioComponent = componentDef({
  name: 'oryx-radio',
  impl: () => import('./radio.component').then((m) => m.RadioComponent),
  stylesheets: [
    {
      rules: () => import('./radio.styles').then((m) => m.screenStyles),
    },
  ],
});
