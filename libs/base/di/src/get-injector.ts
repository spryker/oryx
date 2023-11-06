/* eslint-disable @typescript-eslint/ban-types */
import { Injector } from './injector';
import { Provider } from './models/provider';

export const enum InjectorContextKey {
  App,
}
export type InjectorContext = string | symbol | InjectorContextKey.App;

export interface InjectorOptions {
  context?: InjectorContext;
  parent?: Injector;
  providers?: Provider[];
}

let _injectorsRegistry: Map<InjectorContext, Injector>;

const REGISTRY_KEY = '_oryxInjectorsRegistry';

function getRegistry(): Map<InjectorContext, Injector> {
  if (!_injectorsRegistry) {
    if ((globalThis as any)[REGISTRY_KEY]) {
      _injectorsRegistry = (globalThis as any)[REGISTRY_KEY];
    } else {
      _injectorsRegistry = new Map<InjectorContext, Injector>();
      (globalThis as any)[REGISTRY_KEY] = _injectorsRegistry;
    }
  }
  return _injectorsRegistry;
}

let _theAppContext: InjectorContext | undefined;

function defaultContext(): InjectorContext {
  return _theAppContext ?? '';
}

/**
 * Function will return injector for the current context
 *
 * You may have different injectors working for different context.
 *
 * For most SSR rendering solutions, proper context (for rendering run) should be provided,
 * otherwise there is a risk that injector will be shared between renders.
 *
 * @param context
 */
export function getInjector(
  context: InjectorContext = defaultContext()
): Injector {
  const registry = getRegistry();
  if (registry.has(context)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return registry.get(context)!;
  }
  throw new Error('No injector found!');
}

/**
 * Create an injector for specified context.
 *
 * If context is not specified, injector is created globally.
 * if context is specified as InjectorContextKey.App, application injector is shared by all components build together, using singleton context
 *
 * Returns teardown logic
 *
 * @param options
 */
export function createInjector(options: InjectorOptions): Injector {
  const isAppInjector = (context?: InjectorContext): boolean => {
    if (context === InjectorContextKey.App) {
      if (!_theAppContext) {
        _theAppContext = Symbol();
      }

      return true;
    }

    return false;
  };

  const { context, parent, providers } = {
    ...options,
    context: isAppInjector(options.context)
      ? (_theAppContext as InjectorContext)
      : options.context ?? '',
  };

  const registry = getRegistry();

  if (registry.has(context)) {
    throw new Error(
      `Injector already created for context - ${
        options.context === InjectorContextKey.App ? 'App' : String(context)
      }`
    );
  }

  registry.set(context, new Injector(providers, parent));
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return registry.get(context)!;
}

/**
 * Invoke destroy method of an injector and remove it from the registry
 *
 * @param context - Injector context.
 */
export function destroyInjector(context: InjectorContext = ''): void {
  context =
    context === InjectorContextKey.App
      ? (_theAppContext as InjectorContext)
      : context;

  const registry = getRegistry();

  if (!registry.has(context)) {
    return;
  }

  registry.get(context)?.destroy();
  registry.delete(context);

  if (context === InjectorContextKey.App) {
    _theAppContext = undefined;
  }
}
