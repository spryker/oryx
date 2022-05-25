/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DecoratorContext,
  TargetDecorator,
} from '@spryker-oryx/typescript-utils';
import { LitElement, ReactiveElement } from 'lit';
import { ResolveController } from './resolve.controller';

interface ResolveData {
  token: keyof InjectionTokensContractMap;
  defaultValue?: any;
  key: string;
}

const RESOLVE_CONTROLLER = Symbol('resolveController');

function controllerCreation(
  target: any,
  token: keyof InjectionTokensContractMap,
  defaultValue?: any
): void {
  if (!target[RESOLVE_CONTROLLER]) {
    const descriptor = {
      value: new ResolveController(target),
      enumerable: false,
      configurable: true,
    };

    Object.defineProperty(target, RESOLVE_CONTROLLER, descriptor);
  }

  (target[RESOLVE_CONTROLLER] as ResolveController).add(token, defaultValue);
}

const legacyService = (context: TargetDecorator, data: ResolveData): void => {
  (context.constructor as typeof LitElement).addInitializer(
    (instance: ReactiveElement) => {
      controllerCreation(instance, data.token, data.defaultValue);
    }
  );

  Object.defineProperty(context, data.key, {
    get: function (this: TargetDecorator) {
      return (this[RESOLVE_CONTROLLER] as ResolveController).resolve(
        data.token
      );
    },
    enumerable: false,
    configurable: true,
  });
};

const standardService = (
  context: DecoratorContext,
  data: ResolveData
): DecoratorContext => {
  return {
    ...context,
    initializer(this: TargetDecorator): unknown {
      controllerCreation(this, data.token, data.defaultValue);

      return (this[RESOLVE_CONTROLLER] as ResolveController).resolve(
        data.token
      );
    },
  };
};

export function service(
  token: keyof InjectionTokensContractMap,
  defaultValue?: any
): any {
  return (
    context: DecoratorContext | TargetDecorator,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const isLegacy = name !== undefined;
    const resolveData: ResolveData = {
      key: (isLegacy ? name : context.key) as string,
      token,
      defaultValue,
    };

    return isLegacy
      ? legacyService(context as TargetDecorator, resolveData)
      : standardService(context as DecoratorContext, resolveData);
  };
}
