import { componentDef } from '@spryker-oryx/utilities';

export const multiRangeComponent = componentDef({
  name: 'oryx-multi-range',
  impl: () =>
    import('./multi-range.component').then((m) => m.MultiRangeComponent),
});
