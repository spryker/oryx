/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement } from 'lit';
import { DecoratorContext } from '../internal/types';
import { SubscribeController } from './subscribe.controller';

const SUBSCRIBE_CONTROLLER = Symbol('subscribeController');

function controllerCreation(target: any, name: string): void {
  if (!target[SUBSCRIBE_CONTROLLER]) {
    const descriptor = {
      value: new SubscribeController(target, name),
      enumerable: false,
      configurable: true,
    };

    Object.defineProperty(target, SUBSCRIBE_CONTROLLER, descriptor);

    return;
  }

  target[SUBSCRIBE_CONTROLLER].add(name);
}

const legacySubscribe = (context: Record<string, any>, name: string): void => {
  const nativeConnected = context.connectedCallback;

  context.connectedCallback = function (): void {
    controllerCreation(this, name);
    nativeConnected.call(this);
  };
};

const standardSubscribe = (
  context: DecoratorContext,
  name: string
): DecoratorContext => {
  return {
    ...context,
    initializer(this: Record<string, any> & LitElement): any {
      controllerCreation(this, name);
      return context.initializer?.();
    },
  };
};

/**
 * Marking a class property with `@subscribe` will create subscription of decorated observable on connectedCallback and unsubscribe
 * of that property on disconnectedCallback
 *
 * Example
 * export class Component extends LitElement {
 *  @subscribe()
 *  prop = from([1, 2, 3, 4]).pipe(// implementation //);
 * }
 */

export function subscribe(): any {
  return (
    context: DecoratorContext | Record<string, any>,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const isLegacy = name !== undefined;
    const propName = (isLegacy ? name : context.key) as string;

    return isLegacy
      ? legacySubscribe(context as Record<string, any>, propName)
      : standardSubscribe(context as DecoratorContext, propName);
  };
}
