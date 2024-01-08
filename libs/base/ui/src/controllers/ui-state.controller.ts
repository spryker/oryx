import { LitElement, ReactiveController } from 'lit';

export class UiStateController implements ReactiveController {
  /**
   * The open state is kept in memory.
   */
  static state: { [key: string]: unknown } = {};

  hostConnected?(): void;

  constructor(protected host: LitElement) {
    this.host.addController(this);
  }

  has(key: string): boolean {
    return UiStateController.state[this.resolveKey(key)] !== undefined;
  }

  get<T = unknown>(key: string): T {
    return UiStateController.state[this.resolveKey(key)] as T;
  }

  set<T = unknown>(key: string, value: T): void {
    UiStateController.state[this.resolveKey(key)] = value;
  }

  protected resolveKey(key: string): string {
    return `${this.host.localName}-${key}`;
  }
}
