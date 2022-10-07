import { DecoratorContext, TargetDecorator } from '../../decorator';

export const HOOKS_KEY = '_oryx.hooks';
declare module '../../decorator' {
  interface TargetDecorator {
    [HOOKS_KEY]?: Record<string, string>;
  }

  interface DecoratorContext {
    [HOOKS_KEY]?: Record<string, string>;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hook(token: string): any {
  return (
    context: DecoratorContext | TargetDecorator,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const isLegacy = name !== undefined;
    const propName = (isLegacy ? name : context.key) as string;

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
}
