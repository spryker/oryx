import { componentDef } from '@spryker-oryx/core';

export * from './icon-button.component';
export * from './icon-button.model';
export * from './icon-button.styles';

export const iconButtonComponent = componentDef({
  name: 'oryx-icon-button',
  impl: () =>
    import('./icon-button.component').then((m) => m.IconButtonComponent),
});
