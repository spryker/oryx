/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  DecoratorContext,
  TargetDecorator,
} from '@spryker-oryx/typescript-utils';
import { LitElement, ReactiveElement } from 'lit';
import { SubscribeController } from './subscribe.controller';

const SUBSCRIBE_CONTROLLER = Symbol('subscribeController');

function controllerCreation(target: any): void {
  if (!target[SUBSCRIBE_CONTROLLER]) {
    const descriptor = {
      value: new SubscribeController(target),
      enumerable: false,
      configurable: true,
    };

    Object.defineProperty(target, SUBSCRIBE_CONTROLLER, descriptor);
  }
}

const legacySubscribe = (context: TargetDecorator, name: string): void => {
  const constructor = context.constructor as typeof LitElement;
  const internalKey = Symbol(name);

  Object.defineProperty(context, name, {
    get: function (this: TargetDecorator) {
      return this[internalKey];
    },
    set: function (this: TargetDecorator, observable$: unknown) {
      if (!this[internalKey]) {
        (this[SUBSCRIBE_CONTROLLER] as SubscribeController).add(observable$);
      }

      this[internalKey] = observable$;
    },
    configurable: true,
  });

  constructor.addInitializer((instance: ReactiveElement) => {
    controllerCreation(instance);
  });
};

const standardSubscribe = (context: DecoratorContext): DecoratorContext => {
  return {
    ...context,
    initializer(this: TargetDecorator): void {
      const observable$ = context.initializer?.call(this);
      controllerCreation(this);
      (this[SUBSCRIBE_CONTROLLER] as SubscribeController).add(observable$);
      return observable$;
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
      : standardSubscribe(context as DecoratorContext);
  };
}
