/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, ReactiveElement } from 'lit';
import { DecoratorContext, TargetDecorator } from '../internal/types';
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

const legacySubscribe = (context: TargetDecorator, name: string): void => {
  const constructor = context.constructor as typeof LitElement;

  constructor.addInitializer((instance: ReactiveElement) => {
    controllerCreation(instance, name);
  });
};

const standardSubscribe = (
  context: DecoratorContext,
  name: string
): DecoratorContext => {
  return {
    ...context,
    initializer(this: TargetDecorator): void {
      controllerCreation(this, name);
      return context.initializer?.call(this);
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
    context: DecoratorContext | TargetDecorator,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const isLegacy = name !== undefined;
    const propName = (isLegacy ? name : context.key) as string;

    return isLegacy
      ? legacySubscribe(context as TargetDecorator, propName)
      : standardSubscribe(context as DecoratorContext, propName);
  };
}
