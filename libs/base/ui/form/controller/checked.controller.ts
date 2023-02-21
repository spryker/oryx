import { LitElement, ReactiveController } from 'lit';
import { getControl } from '../utilities/getControl';

export class CheckedController implements ReactiveController {
  protected _connected = false;

  hostConnected(): void {
    this._connected = true;
  }

  hostDisconnected(): void {
    this._connected = false;
    this.controlAttrsObserver?.disconnect();
  }

  onSlotChange(): void {
    //slotchange event dispatches even after disconnected life-circle hook
    //need to check whether host still connected or not
    if (!this._connected) {
      return;
    }

    this.observe();
  }

  protected controlAttrsObserver?: MutationObserver;

  protected observe(): void {
    this.controlAttrsObserver?.disconnect();
    this.controlAttrsObserver = new MutationObserver(() => {
      this.alignCheckedState();
    });
    this.controlAttrsObserver.observe(this.control, {
      attributeFilter: ['checked'],
    });
  }

  protected alignCheckedState(): void {
    if (
      this.control &&
      this.control.hasAttribute('checked') !== this.control.checked
    ) {
      this.control.checked = this.control.hasAttribute('checked');
    }

    this.control.dispatchEvent(new InputEvent('change'));
  }

  protected get control(): HTMLInputElement {
    return getControl(this.host);
  }

  constructor(protected host: LitElement) {
    this.host.addController(this);

    this.onSlotChange = this.onSlotChange.bind(this);
  }
}
