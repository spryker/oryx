import { componentDef } from '@spryker-oryx/utilities';

export const iconButtonComponent = componentDef({
  name: 'oryx-icon-button',
  impl: () =>
    import('./icon-button.component').then((m) => m.IconButtonComponent),
});
