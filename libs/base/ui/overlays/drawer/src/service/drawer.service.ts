import { OverlayService, OverlayServiceOptions } from '@spryker-oryx/ui';
import { DrawerComponent } from '../drawer.component';
import { TAG_NAME } from '../tag';

interface DrawerServiceToggleOptions extends OverlayServiceOptions {
  force?: boolean;
  closeOtherDrawers?: boolean;
}

export class DrawerService extends OverlayService<DrawerComponent> {
  get({
    selector = TAG_NAME,
    parent,
  }: DrawerServiceToggleOptions): DrawerComponent {
    const element = super.getParent(parent).querySelector(selector);

    if (!(element instanceof DrawerComponent))
      throw new Error('Drawer element not found');

    return element;
  }

  toggle({
    selector = TAG_NAME,
    force,
    closeOtherDrawers = true,
    parent,
  }: DrawerServiceToggleOptions): void {
    const element = this.get({ selector, parent });

    if (closeOtherDrawers) this.findAndCloseOtherDrawers(element);

    element?.dialog?.[force ?? !element?.dialog?.open ? 'show' : 'close']?.();
  }

  protected findAndCloseOtherDrawers(current?: DrawerComponent): void {
    const otherDrawers: NodeListOf<DrawerComponent> =
      document.querySelectorAll(TAG_NAME);

    otherDrawers.forEach((drawer: DrawerComponent): void => {
      if (drawer !== current && drawer.dialog?.open) drawer.dialog?.close();
    });
  }
}
