import { Injectable } from './injectable';

describe('Injectable', () => {
  it('should return default implementation when provided', () => {
    const defaultImpl = { impl: true };
    const injectable = new Injectable('test', defaultImpl, {});

    expect(injectable.get()).toBe(defaultImpl);
  });

  it('should throw without a default implementation', () => {
    const injectable = new Injectable('test', undefined, {});

    expect(() => injectable.get()).toThrow();
  });

  it('should replace default implementation with injected', () => {
    const defaultImpl = { impl: true };
    const newImpl = { impl: true };
    const injectable = new Injectable('test', defaultImpl, {});

    injectable.inject(newImpl);

    expect(injectable.get()).toBe(newImpl);
  });

  it('should provide new injected implementation', () => {
    const newImpl = { impl: true };
    const injectable = new Injectable<{ impl: boolean }>('test', undefined, {});

    injectable.inject(newImpl);

    expect(injectable.get()).toBe(newImpl);
  });

  it('should share implementation from same container', () => {
    const container = {};
    const impl = { impl: true };
    const injectable1 = new Injectable('test', impl, container);
    const injectable2 = new Injectable('test', undefined, container);

    expect(injectable1.get()).toBe(injectable2.get());
  });

  it('should use globalThis for container by default', () => {
    const container = {};
    const impl = { impl: true };
    vi.stubGlobal(Injectable.GlobalKey, container);
    const injectable1 = new Injectable('test', impl, container);
    const injectable2 = new Injectable('test');

    expect(injectable1.get()).toBe(injectable2.get());

    // Clear global stub
    delete (globalThis as any)[Injectable.GlobalKey];
  });
});
