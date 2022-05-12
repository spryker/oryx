import { createInjector, destroyInjector, getInjector } from './get-injector';
import { Injector } from './injector';

describe('getInjector', () => {
  it('should return different injectors per context', () => {
    const context1 = {};
    const context2 = {};
    const injector1 = createInjector({ context: context1 });
    const injector2 = createInjector({ context: context2 });
    expect(getInjector(context1)).toBe(injector1);
    expect(getInjector(context2)).toBe(injector2);
  });
});

describe('destroyInjector', () => {
  const context = {};
  let injector: Injector;

  beforeEach(() => {
    injector = createInjector({ context: context });
    vi.spyOn(injector, 'destroy');
  });

  it('should remove injector', () => {
    expect(getInjector(context)).toBe(injector);

    destroyInjector(context);

    expect(() => getInjector(context)).toThrowError();
  });

  it('should invoke destroy method of injector', () => {
    destroyInjector(context);

    expect(injector.destroy).toHaveBeenCalled();
  });

  it('should not throw an error if no injector', () => {
    expect(() => destroyInjector({})).not.toThrowError();
  });
});
