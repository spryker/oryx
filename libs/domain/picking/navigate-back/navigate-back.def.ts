import { componentDef } from '@spryker-oryx/utilities';

export const navigateBackComponent = componentDef({
  name: 'oryx-navigate-back',
  impl: () =>
    import('./navigate-back.component').then((m) => m.NavigateBackComponent),
  schema: () =>
    import('./navigate-back.schema').then((m) => m.navigateBackComponentSchema),
});
