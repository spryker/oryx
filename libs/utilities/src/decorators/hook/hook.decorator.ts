import { DecoratorContext, TargetDecorator } from '../../model';

export const HOOKS_KEY = '_oryx.hooks';
declare module '../../model' {
  interface TargetDecorator {
    [HOOKS_KEY]?: Record<string, string>;
  }
}

const createHook = (
  context: TargetDecorator,
  token: string,
  propName: string
): void => {
  if (!context[HOOKS_KEY]) {
    Object.defineProperty(context, HOOKS_KEY, {
      value: {
        [token]: propName,
      },
      enumerable: false,
      configurable: true,
      writable: true,
    });

    return;
  }

  Object.assign(context[HOOKS_KEY], {
    [token]: propName,
  });
};

const standardHook = (
  context: DecoratorContext,
  token: string,
  propName: string
): DecoratorContext => {
  return {
    ...context,
    finisher(clazz: TargetDecorator): void {
      createHook(clazz, token, propName);
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hook(token: string): any {
  return (
    context: DecoratorContext | TargetDecorator,
    name?: PropertyKey
  ): void => {
    const isLegacy = (
      context: DecoratorContext | TargetDecorator,
      name?: PropertyKey
    ): context is TargetDecorator => {
      return name !== undefined;
    };
    const propName = (isLegacy(context, name) ? name : context.key) as string;

    return isLegacy(context, name)
      ? createHook(context, token, propName)
      : (standardHook(context, token, propName) as unknown as void);
  };
}
