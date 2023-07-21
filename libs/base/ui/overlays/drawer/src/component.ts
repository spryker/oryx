import { componentDef } from '@spryker-oryx/utilities';
import { TAG_NAME } from './tag';

export const drawerComponent = componentDef({
  name: TAG_NAME,
  impl: () =>
    globalThis.HTMLDialogElement
      ? import('./drawer.component').then((m) => m.DrawerComponent)
      : import('./no-dialog-support/drawer.component').then(
          (m) => m.NDSDrawerComponent
        ),
});
