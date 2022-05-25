import { createInjector, destroyInjector } from '../get-injector';
import { resolve } from './resolve';

describe('resolve', () => {
  const context = {};

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
    expect(resolve(undefined, 'a')).toBe('b');
  });

  it('should throw error for not provided token', () => {
    expect(() => resolve(undefined, 'c')).toThrow();
  });

  describe('with default value', () => {
    it('should resolve token', () => {
      expect(resolve(undefined, 'a', 'fallback')).toBe('b');
    });
    it('should fallback to default value', () => {
      expect(resolve(undefined, 'c', 'fallback')).toBe('fallback');
    });
  });

  describe('with context', () => {
    it('should resolve token for a context', () => {
      expect(resolve(context, 'a', undefined)).toBe('z');
    });

    it('should fallback to global context', () => {
      expect(resolve('nonexisting context', 'a')).toBe('b');
    });

    it('should throw error for missing provider', () => {
      expect(() => resolve('nonexisting context', 'z', undefined)).toThrow();
    });

    it('should resolve default value for missing provider', () => {
      expect(resolve('nonexisting context', 'z', 'v')).toBe('v');
    });
  });
});
