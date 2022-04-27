export * from './drawer.component';
export * from './drawer.model';
export * from './service';
export * from './styles';

import { DrawerComponent, TAG_NAME } from './drawer.component';
import { NDSDrawerComponent } from './no-dialog-support/drawer.component';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (window.HTMLDialogElement) {
  customElements.get(TAG_NAME) ||
    customElements.define(TAG_NAME, DrawerComponent);
} else {
  customElements.get(TAG_NAME) ||
    customElements.define(TAG_NAME, NDSDrawerComponent);
}
