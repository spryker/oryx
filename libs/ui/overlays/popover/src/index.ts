import { componentDef } from '@spryker-oryx/core';
import { TAG_NAME } from './popover.component';

export * from './controllers';
export * from './popover.component';
export * from './popover.controller';
export * from './popover.model';
export * from './styles';

export const popoverComponent = componentDef({
  name: TAG_NAME,
  impl: () => import('./popover.component').then((m) => m.PopoverComponent),
});
