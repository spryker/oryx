import { componentDef } from '@spryker-oryx/core';
import { TAG_NAME } from './tag';

export const drawerComponent = componentDef({
  name: TAG_NAME,
  impl: () =>
    window.HTMLDialogElement
      ? import('./drawer.component').then((m) => m.DrawerComponent)
      : import('./no-dialog-support/drawer.component').then(
          (m) => m.NDSDrawerComponent
        ),
});
