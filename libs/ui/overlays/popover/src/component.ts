import { componentDef } from '@spryker-oryx/core';
import { TAG_NAME } from './utilities';

export const popoverComponent = componentDef({
  name: TAG_NAME,
  impl: () => import('./popover.component').then((m) => m.PopoverComponent),
});
