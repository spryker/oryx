import { componentDef } from '@spryker-oryx/utilities';

export const pickingPickerComponent = componentDef({
  name: 'oryx-picking-picker',
  impl: () =>
    import('./picker.component').then((m) => m.PickingPickerComponent),
});
