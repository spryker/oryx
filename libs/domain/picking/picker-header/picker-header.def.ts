import { componentDef } from '@spryker-oryx/utilities';

export const pickerHeaderComponent = componentDef({
  name: 'oryx-picking-picker-header',
  impl: () =>
    import('./picker-header.component').then((m) => m.PickerHeaderComponent),
});
