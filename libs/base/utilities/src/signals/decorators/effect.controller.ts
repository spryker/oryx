import { resolve } from '@spryker-oryx/di';
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Effect } from '../core';

export class EffectController implements ReactiveController {
  protected effects = new Map<string, Effect>();

  // TODO: temporary solution should be solved with proper hook provided from lit
  protected context = resolve('FES.ContextService', null);

  constructor(public host: ReactiveControllerHost) {
    (this.host = host).addController(this);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.context as any)?.rendered$?.subscribe?.(() =>
      this.hostDisconnected()
    );
  }

  hostConnected(): void {
    for (const effect of this.effects.values()) effect.start();
  }

  hostDisconnected(): void {
    for (const effect of this.effects.values()) effect.stop();
  }

  add(effect: Effect | (() => void), key: string): void {
    if (this.effects.has(key)) this.effects.get(key)?.stop();

    if (typeof effect === 'function')
      effect = new Effect(effect, { defer: true });

    // add some logic to check if it is an effect, allow for specifying full effect
    this.effects.set(key, effect);
  }

  get(key: string): Effect | undefined {
    return this.effects.get(key);
  }
}
