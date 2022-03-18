import { LitElement, ReactiveController } from 'lit';
import { CLOSE_EVENT, OPEN_EVENT, Types } from './notification.model';

interface HostProps extends LitElement {
  type: Types;
}

export class EventsController implements ReactiveController {
  protected dispatchOpenEvent(): void {
    this.host.dispatchEvent(
      new CustomEvent(OPEN_EVENT, {
        bubbles: true,
        composed: true,
      })
    );
  }

  dispatchCloseEvent(): void {
    this.host.dispatchEvent(
      new CustomEvent(CLOSE_EVENT, {
        bubbles: true,
        composed: true,
      })
    );
  }

  constructor(public host: HostProps) {
    this.host.addController(this);
  }

  hostConnected(): void {
    this.dispatchOpenEvent();
  }
}
