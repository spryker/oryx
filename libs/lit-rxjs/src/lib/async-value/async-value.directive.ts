import { noChange } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';
import { Observable, Subscription } from 'rxjs';
import { isObservable, isPromise } from '../internal';
import { AsyncValueObservableStrategy } from './async-value-observable-strategy';
import { AsyncValuePromiseStrategy } from './async-value-promise-strategy';
import { AsyncValueStrategy } from './types';

const asyncValueObservableInstance = new AsyncValueObservableStrategy();
const asyncValuePromiseInstance = new AsyncValuePromiseStrategy();

export class AsyncValueDirective extends AsyncDirective {
  object: Promise<unknown> | Observable<unknown> | null = null;
  strategy: AsyncValueStrategy | null = null;
  subscription: Subscription | Promise<unknown> | null = null;

  render(
    object: Promise<unknown> | Observable<unknown> | null | undefined
  ): unknown {
    if (object && !this.object && this.isConnected) {
      this.subscribe(object);
    }

    if (object !== undefined && object !== this.object && this.isConnected) {
      this.dispose();
      this.render(object);
    }

    return noChange;
  }

  disconnected(): void {
    this.dispose();
  }

  reconnected(): void {
    if (this.object) {
      this.subscribe(this.object);
    }
  }

  private subscribe(object: Promise<unknown> | Observable<unknown>): void {
    this.object = object;
    this.strategy = this.select(object);

    this.subscription = this.strategy.createSubscription(object, (value) => {
      this.setValue(value);
    });
  }

  private dispose(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.strategy?.dispose(this.subscription!);
    this.object = null;
    this.strategy = null;
    this.subscription = null;
    this.setValue(null);
  }

  private select(
    object: Observable<unknown> | Promise<unknown>
  ): AsyncValueStrategy {
    if (isPromise(object)) {
      return asyncValuePromiseInstance;
    }

    if (isObservable(object)) {
      return asyncValueObservableInstance;
    }

    throw `Invalid AsyncValueDirective: ${object} for AsyncValueDirective`;
  }
}

/**
 * The asyncValue directive subscribes to an Observable or Promise and returns the latest value it has emitted.
 * When the component gets destroyed, the asyncValue directive unsubscribes automatically to avoid potential memory leaks.
 * When the reference of the expression changes, the asyncValue directive automatically unsubscribes from the old Observable or Promise and subscribes to the new one.
 */
export const asyncValue = directive(AsyncValueDirective);
