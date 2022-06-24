import {
  createAppInjector,
  createInjector,
  destroyAppInjector,
  destroyInjector,
  getInjector,
} from './get-injector';
import { Injector } from './injector';

describe('getInjector', () => {
  it('should return different injectors per context', () => {
    const context1 = 'ctx1';
    const context2 = 'ctx2';
    const injector1 = createInjector({ context: context1 });
    const injector2 = createInjector({ context: context2 });
    expect(getInjector(context1)).toBe(injector1);
    expect(getInjector(context2)).toBe(injector2);
    destroyInjector(context1);
    destroyInjector(context2);
  });
});

describe('createInjector', () => {
  it('should create DI container for default scope', () => {
    const injector = createInjector({});
    expect(getInjector()).toBe(injector);
    destroyInjector();
  });

  it('should create DI container for specified scope', () => {
    const injector = createInjector({ context: 'test' });
    expect(getInjector('test')).toBe(injector);
    destroyInjector('test');
  });

  it('should create DI container with providers', () => {
    const injector = createInjector({
      providers: [{ provide: 'A', useValue: 'B' }],
    });
    expect(injector.inject('A')).toBe('B');
    destroyInjector();
  });

  it('should not override existing container', () => {
    createInjector({});
    expect(() => createInjector({})).toThrow();
    destroyInjector();
  });
});

describe('createAppInjector', () => {
  it('should create separate UI container for the application', () => {
    const injector = createInjector({});
    const appInjector = createAppInjector({});
    expect(injector).not.toBe(appInjector);
    destroyAppInjector();
    destroyInjector();
  });

  it('should be able to reuse global injector as a parent', () => {
    createInjector({
      providers: [
        {
          provide: 'A',
          useValue: 'B',
        },
      ],
    });
    const appInjector = createAppInjector({ parent: getInjector() });
    expect(appInjector.inject('A')).toBe('B');
    destroyAppInjector();
    destroyInjector();
  });

  it('should not create app injector if already created', () => {
    createAppInjector({});
    expect(() => createAppInjector({})).toThrow();
    destroyAppInjector();
  });
});

describe('destroyInjector', () => {
  const context = 'ctx';
  let injector: Injector;

  it('should remove injector', () => {
    injector = createInjector({ context: context });
    vi.spyOn(injector, 'destroy');
    expect(getInjector(context)).toBe(injector);

    destroyInjector(context);

    expect(() => getInjector(context)).toThrowError();
  });

  it('should invoke destroy method of injector', () => {
    injector = createInjector({ context: context });
    vi.spyOn(injector, 'destroy');
    destroyInjector(context);

    expect(injector.destroy).toHaveBeenCalled();
  });

  it('should not throw an error if no injector', () => {
    expect(() => destroyInjector('non-existing context')).not.toThrowError();
  });
});

describe('destroyAppInjector', () => {
  it('should destroy app injector', () => {
    createAppInjector({});
    expect(getInjector()).toBeTruthy();
    destroyAppInjector();
    expect(() => getInjector()).toThrow();
  });
});
