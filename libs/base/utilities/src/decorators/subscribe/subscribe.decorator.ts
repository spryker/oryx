import { LitElement, ReactiveControllerHost, ReactiveElement } from 'lit';
import { isLegacyDecorator } from '../../guards';
import { DecoratorContext, TargetDecorator } from '../../model';
import { SubscribeController } from './subscribe.controller';

const SUBSCRIBE_CONTROLLER = Symbol('subscribeController');

function controllerCreation(target: TargetDecorator): void {
  if (!target[SUBSCRIBE_CONTROLLER]) {
    const descriptor = {
      value: new SubscribeController(target as ReactiveControllerHost),
      enumerable: false,
      configurable: true,
    };

    Object.defineProperty(target, SUBSCRIBE_CONTROLLER, descriptor);
  }
}

const legacySubscribe = (context: TargetDecorator, name: string): void => {
  const constructor = context.constructor as typeof LitElement;
  const internalKey = Symbol(name);
  const willUpdate = context['willUpdate'];

  Object.defineProperty(context, name, {
    get: function (this: TargetDecorator) {
      return this[internalKey];
    },
    set: function (this: TargetDecorator, observable$: unknown) {
      if (!this[internalKey]) {
        (this[SUBSCRIBE_CONTROLLER] as SubscribeController).add(
          observable$,
          name
        );
      }

      this[internalKey] = observable$;
    },
    configurable: true,
  });

  context['willUpdate'] = function (props): void {
    (this[SUBSCRIBE_CONTROLLER] as SubscribeController).hostConnected();
    willUpdate.call(this, props);
  };

  constructor.addInitializer((instance: ReactiveElement) => {
    controllerCreation(instance as TargetDecorator);
  });
};

const standardSubscribe = (
  context: DecoratorContext,
  name: string
): DecoratorContext => {
  return {
    ...context,
    initializer(this: TargetDecorator): void {
      const observable$ = context.initializer?.call(this);
      controllerCreation(this);
      (this[SUBSCRIBE_CONTROLLER] as SubscribeController).add(
        observable$,
        name
      );
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
 *
 * NOTE: This decorator should be used only with LitElement (or mixing) and will not work properly, when used inside other classes
 * like controllers or services.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function subscribe(): any {
  return (
    context: DecoratorContext | TargetDecorator,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const propName = (
      isLegacyDecorator(context, name) ? name : context.key
    ) as string;

    return isLegacyDecorator(context, name)
      ? legacySubscribe(context, propName)
      : (standardSubscribe(context, propName) as unknown as void);
  };
}
