import { Injector } from './injector';
import { Provider } from './provider';

/**
 * By default, injectors can be assigned to DOM Elements. Each DOM element can
 * provide a context for the injector.
 */
export interface InjectorContext {
  parentNode?: InjectorContext;
}

let _injectorsRegistry: WeakMap<InjectorContext | any, Injector>;

function getRegistry(
  globalVariable = '_injectorsRegistry'
): WeakMap<InjectorContext | any, Injector> {
  if (!_injectorsRegistry) {
    if ((globalThis as any)[globalVariable]) {
      _injectorsRegistry = (globalThis as any)[globalVariable];
    } else {
      _injectorsRegistry = new WeakMap<InjectorContext, Injector>();
    }
  }
  return _injectorsRegistry;
}

function defaultContext(): Document | typeof globalThis {
  return globalThis.document ?? globalThis;
}

/**
 * Function will return injector for the current context
 *
 * You may have different injectors working for different context.
 * By default, the window.document is used as a context, which works fine for the browser
 * or even for some SSR implementations.
 *
 * For most SSR rendering solutions, proper context (for rendering run) should be provided, otherwise injector could
 * be shared between different renders.
 *
 * @param context
 */
export function getInjector(
  context: Element | InjectorContext | any = defaultContext()
): Injector {
  const registry = getRegistry();
  while (context) {
    if (registry.has(context)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return registry.get(context)!;
    }
    context = context.parentNode ?? context.host;
  }
  if (registry.has(defaultContext())) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return registry.get(defaultContext())!;
  }
  throw new Error('No injector found!');
}

/**
 * Create an injector for specified context.
 *
 * Is context is not specified, injector is created globally.
 *
 * Returns teardown logic
 *
 * @param options
 */
export function createInjector(options: {
  context?: InjectorContext;
  parent?: Injector;
  providers?: Provider[];
  override?: boolean;
}): Injector {
  const { context, parent, providers, override } = {
    ...options,
    context: options.context ?? defaultContext(),
  };
  const registry = getRegistry();
  if (!override && registry.has(context)) {
    throw new Error('Injector already created for context');
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

export function destroyInjector(
  context: Element | InjectorContext | any = defaultContext()
): void {
  const registry = getRegistry();

  if (!registry.has(context)) {
    return;
  }

  registry.get(context)?.destroy();
  registry.delete(context);
}

/**
 * Enable sharing injector between different copies of the injector code.
 *
 * Useful for cases, where injector code is bundled statically instead of an
 * external import
 *
 * @param gobalVariable - Name of the global variable, that will be used for sharing global injector.
 */
export function enableSharedInjectorRegistry(
  globalVariable = '_injectorsRegistry'
): void {
  if (!(globalThis as any)[globalVariable]) {
    _injectorsRegistry = new WeakMap<InjectorContext, Injector>();
    (globalThis as any)[globalVariable] = _injectorsRegistry;
  }
}
