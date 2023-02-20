import { componentDef } from '@spryker-oryx/core';
import { isServer } from 'lit';
import { TAG_NAME } from './tag';

export const drawerComponent = componentDef({
  name: TAG_NAME,
  impl: () =>
    !isServer && window.HTMLDialogElement
      ? import('./drawer.component').then((m) => m.DrawerComponent)
      : import('./no-dialog-support/drawer.component').then(
          (m) => m.NDSDrawerComponent
        ),
});
