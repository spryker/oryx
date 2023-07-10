import { ReactiveController, ReactiveControllerHost } from 'lit';
import { SignalConsumer } from './core';

const signalControllerMark = Symbol.for('SignalController');

export class SignalController implements ReactiveController {
  protected consumer!: SignalConsumer;

  constructor(
    protected host: ReactiveControllerHost & {
      [signalControllerMark]?: SignalController;
    }
  ) {
    // to avoid adding the same controller twice
    if (this.host[signalControllerMark]) return;

    this.host[signalControllerMark] = this;
    this.consumer = new SignalConsumer(() => this.host.requestUpdate());
    this.host.addController(this);
  }

  hostConnected(): void {
    this.consumer.start();
  }

  hostDisconnected(): void {
    this.consumer.stop();
  }

  hostUpdate(): void {
    this.consumer.install();
  }

  hostUpdated(): void {
    this.consumer.uninstall();
  }
}
