import { isServer, LitElement } from 'lit';
import { Observable } from 'rxjs';
import { DecoratorContext, TargetDecorator } from '../../model';
import { AsyncStateController } from './async-state.controller';

const ASYNC_STATE_CONTROLLER = Symbol('asyncStateController');

function getController(target: TargetDecorator): AsyncStateController {
  if (!target[ASYNC_STATE_CONTROLLER]) {
    Object.defineProperty(target, ASYNC_STATE_CONTROLLER, {
      value: new AsyncStateController(target as LitElement),
      enumerable: false,
      configurable: true,
    });
  }
  return target[ASYNC_STATE_CONTROLLER] as AsyncStateController;
}

function defineProperty(context: TargetDecorator, name: string) {
  Object.defineProperty(context, name, {
    get: function (this: TargetDecorator) {
      return getController(this).get(name);
    },
    set: function (this: TargetDecorator, observable$: unknown) {
      getController(this).add(name, observable$);
    },
    configurable: true,
  });
}

const legacyAsyncState = (context: TargetDecorator, name: string): void => {
  defineProperty(context, name);
  if (isServer) {
    (context.constructor as any).addInitializer((context: TargetDecorator) => {
      const willUpdate = context['willUpdate'];
      context['willUpdate'] = function (props): void {
        getController(context).hostConnected();
        willUpdate?.call(this, props);
      };
    });
  }
};

const standardAsyncState = (
  context: DecoratorContext,
  name: string
): DecoratorContext => {
  return {
    ...context,
    kind: 'field',
    placement: 'own',
    key: Symbol(),
    descriptor: {},
    initializer(this: TargetDecorator): void {
      defineProperty(this, name);
      if (typeof context.initializer === 'function') {
        this[context.key as string] = context.initializer.call(this);
      }
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asyncState(): any {
  return (
    context: DecoratorContext | TargetDecorator,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const isLegacy = (
      context: unknown,
      name?: PropertyKey
    ): context is TargetDecorator => {
      return name !== undefined;
    };
    const propName = (isLegacy(context, name) ? name : context.key) as string;

    return isLegacy(context, name)
      ? legacyAsyncState(context, propName)
      : standardAsyncState(context, propName);
  };
}

export function valueType<A>(value: Observable<A> | Promise<A>): A | undefined {
  return value as unknown as A | undefined;
}
