import { LitElement } from 'lit/development';
import { Signal, SignalSniffer } from './signals';

export class LitSignalChangeDetector implements SignalSniffer {
  protected signals = new Map<Signal<any>, (() => void) | undefined>();
  protected unusedSignals: Set<Signal<any>> | undefined;

  constructor(protected host: LitElement) {}

  reveal(signal: Signal<any>): void {
    this.unusedSignals?.delete(signal);
    if (!this.signals.has(signal)) {
      this.signals.set(signal, signal.subscribe(this.update));
    }
  }

  installed(): void {
    this.unusedSignals = new Set(this.signals.keys());
  }

  uninstalled(): void {
    for (const signal of this.unusedSignals!) {
      this.signals.get(signal)?.();
      this.signals.delete(signal);
    }
    this.unusedSignals = undefined;
  }

  update = () => {
    this.host.requestUpdate();
  };

  start(): void {}

  stop(): void {
    for (const dispose of this.signals.values()) {
      dispose?.();
    }
    this.signals.clear();
  }
}
