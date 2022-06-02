export * from './drawer.component';
export * from './drawer.model';
export * from './service';
export * from './styles';

import { DrawerComponent, TAG_NAME } from './drawer.component';
import { NDSDrawerComponent } from './no-dialog-support/drawer.component';

customElements.get(TAG_NAME) ||
  customElements.define(
    TAG_NAME,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.HTMLDialogElement ? DrawerComponent : NDSDrawerComponent
  );
