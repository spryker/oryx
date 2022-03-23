import { createInjector } from './get-injector';
import { resolve } from './resolve';

describe('resolve', () => {
  const context = {};

  beforeEach(() => {
    createInjector({
      providers: [{ provide: 'a', useValue: 'b' }],
      override: true,
    });
    createInjector({
      context: context,
      providers: [{ provide: 'a', useValue: 'z' }],
      override: true,
    });
  });

  it('should resolve token', () => {
    expect(resolve('a')).toBe('b');
  });

  it('should trow error for not provided token', () => {
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

    it('should throw error for missing injector', () => {
      expect(() => resolve('a', undefined, 'nonexisting context')).toThrow();
    });

    it('should resolve default value for missing injector', () => {
      expect(resolve('a', 'v', 'nonexisting context')).toBe('v');
    });
  });
});
