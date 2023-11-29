import { componentDef } from '@spryker-oryx/utilities';

export const textComponent = componentDef({
  name: 'oryx-text',
  impl: () => import('./text.component').then((m) => m.TextComponent),
});
