import { ReactiveController } from 'lit';
import { ButtonComponent } from './button.component';

export class ButtonController implements ReactiveController {
  protected disabledAttrObserver?: MutationObserver;

  hostConnected(): void {
    this.reflectDisabledProp();
    this.initObserver();
  }

  hostDisconnected(): void {
    this.disabledAttrObserver?.disconnect();
  }

  protected initObserver(): void {
    const button = this.host.querySelector('button, a');
    if (button) {
      this.disabledAttrObserver = new MutationObserver(() =>
        this.reflectDisabledProp()
      );
      this.disabledAttrObserver.observe(button, {
        attributeFilter: ['disabled'],
      });
    }
  }

  protected reflectDisabledProp(): void {
    this.host.toggleAttribute(
      'disabled',
      this.host.querySelector('button, a')?.hasAttribute('disabled')
    );
  }

  constructor(protected host: ButtonComponent) {
    this.host.addController(this);
  }
}
