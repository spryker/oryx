import { componentDef } from '@spryker-oryx/utilities';

export const pickingPickerHeaderComponent = componentDef({
  name: 'oryx-picking-picker-header',
  impl: () =>
    import('./picker-header.component').then(
      (m) => m.PickingPickerHeaderComponent
    ),
});
