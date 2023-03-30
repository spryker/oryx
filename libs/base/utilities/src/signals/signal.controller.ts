import { ReactiveController, ReactiveControllerHost } from 'lit';
import { SignalConsumer } from './core';

const singnalControllerMark = Symbol.for('SignalController');

export class SignalController implements ReactiveController {
  protected consumer!: SignalConsumer;

  constructor(
    protected host: ReactiveControllerHost & {
      [singnalControllerMark]?: SignalController;
    }
  ) {
    // to avoid adding the same controller twice
    if (this.host[singnalControllerMark]) return;

    this.host[singnalControllerMark] = this;
    this.host.addController(this);
    this.consumer = new SignalConsumer(() => this.host.requestUpdate());
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
