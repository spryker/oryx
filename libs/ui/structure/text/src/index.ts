import { componentDef } from '@spryker-oryx/core';

export * from './text.component';
export * from './text.model';
export * from './text.styles';

export const textComponent = componentDef({
  name: 'oryx-text',
  impl: () => import('./text.component').then((m) => m.TextComponent),
});
