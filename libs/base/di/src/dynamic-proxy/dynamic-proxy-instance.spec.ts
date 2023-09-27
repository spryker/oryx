import { inject, Injector } from '@spryker-oryx/di'; // Replace with your actual import
import { lastValueFrom, of } from 'rxjs';
import { describe, expect } from 'vitest';
import { createLazyProxy } from './dynamic-proxy-instance';

describe('Dynamic Proxy Instance', () => {
  const mockLazyImport = vi.fn(async () => MockImplementation);
  const mockInstanceCallback = vi.fn(() => undefined);
  const mockMethod = vi.fn(() => undefined);
  const mockObservableMethod = vi.fn(() => of('observable value'));

  class MockImplementation {
    dependency = inject('service');
    method = mockMethod;
    observableMethod = mockObservableMethod;
    observableDep = () => of(this.dependency);
  }

  let injector: Injector;

  beforeEach(() => {
    injector = new Injector();
    injector.provide({
      provide: 'service',
      useValue: 'I am a dependency',
    });
  });

  it('should call lazyImport on method call', () => {
    const proxy = createLazyProxy(
      mockLazyImport,
      injector,
      mockInstanceCallback
    );
    proxy.method();
    expect(mockLazyImport).toHaveBeenCalled();
  });

  it('should call instanceCallback with instance', async () => {
    const proxy = createLazyProxy(
      mockLazyImport,
      injector,
      mockInstanceCallback
    );

    proxy.method();
    expect(mockInstanceCallback).toHaveBeenCalledWith(
      expect.any(MockImplementation)
    );
  });

  it('should call method on the instance', async () => {
    const proxy = createLazyProxy(mockLazyImport, injector);

    proxy.method();
    expect(mockMethod).toHaveBeenCalled();
  });

  it('should handle observable methods correctly', async () => {
    const proxy = createLazyProxy(mockLazyImport, injector);

    const result = await lastValueFrom(proxy.observableMethod());
    expect(mockObservableMethod).toHaveBeenCalled();
    expect(result).toBe('observable value');
  });

  it('should use the passed injector for dependencies', async () => {
    const proxy = createLazyProxy(mockLazyImport, injector);

    const result = await lastValueFrom(proxy.observableDep());

    expect(result).toBe('I am a dependency');
  });
});
