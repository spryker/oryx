import { createInjector, destroyInjector } from './get-injector';
import { resolve } from './resolve';

describe('resolve', () => {
  const context = 'test-context';

  beforeEach(() => {
    createInjector({
      providers: [{ provide: 'a', useValue: 'b' }],
    });
    createInjector({
      context: context,
      providers: [{ provide: 'a', useValue: 'z' }],
    });
  });

  afterEach(() => {
    destroyInjector();
    destroyInjector(context);
  });

  it('should resolve token', () => {
    expect(resolve('a')).toBe('b');
  });

  it('should throw error for not provided token', () => {
    expect(() => resolve('c')).toThrow();
  });

  describe('with default value', () => {
    it('should resolve token', () => {
      expect(resolve('a', 'fallback')).toBe('b');
    });
    it('should fallback to default value', () => {
      expect(resolve('c', 'fallback')).toBe('fallback');
    });
  });

  describe('with context', () => {
    it('should resolve token for a context', () => {
      expect(resolve('a', undefined, context)).toBe('z');
    });

    it('should throw error for missing provider', () => {
      expect(() => resolve('z', undefined, 'nonexisting context')).toThrow();
    });

    it('should resolve default value for missing provider', () => {
      expect(resolve('z', 'v', 'nonexisting context')).toBe('v');
    });
  });
});
