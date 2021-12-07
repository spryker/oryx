import { createInjector, getInjector } from './get-injector';

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
