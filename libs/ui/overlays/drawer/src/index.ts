import { componentDef } from '@spryker-oryx/core';
import { TAG_NAME } from './drawer.component';

export * from './drawer.component';
export * from './drawer.model';
export * from './service';
export * from './styles';

export const drawerComponent = componentDef({
  name: TAG_NAME,
  impl: () =>
    window.HTMLDialogElement
      ? import('./drawer.component').then((m) => m.DrawerComponent)
      : import('./no-dialog-support/drawer.component').then(
          (m) => m.NDSDrawerComponent
        ),
});
