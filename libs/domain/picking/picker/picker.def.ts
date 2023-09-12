import { componentDef } from '@spryker-oryx/utilities';

export const pickerComponent = componentDef({
  name: 'oryx-picking-picker',
  impl: () => import('./picker.component').then((m) => m.default),
});
