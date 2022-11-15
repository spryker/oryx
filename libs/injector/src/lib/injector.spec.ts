import { inject } from './inject';
import { INJECTOR, Injector } from './injector';

const mockDestroy = vi.fn();

class MockImplementation {
  dependency = inject('dependency');
}
class DependencyImplementation {}
class ServiceWithDestroy {
  onDestroy = mockDestroy;
}
class MockMultiA {}
class MockMultiB {}

describe('Injector', () => {
  let injector: Injector;

  beforeEach(() => {
    injector = new Injector();
    injector.provide({
      provide: 'service',
      useClass: MockImplementation,
    });
    injector.provide({
      provide: 'dependency',
      useClass: DependencyImplementation,
    });
    injector.provide({
      provide: 'myValue',
      useValue: 'test',
    });
    injector.provide({
      provide: 'destroyService',
      useClass: ServiceWithDestroy,
    });
  });

  describe('class injector', () => {
    it('should provide and inject the service', () => {
      const service = injector.inject('service');
      expect(service).toBeInstanceOf(MockImplementation);
    });

    it('should inject the same instance (singleton)', () => {
      const service = injector.inject('service');
      const service2 = injector.inject('service');
      expect(service).toBe(service2);
    });

    it('should inject itself', () => {
      const injectedInjector = injector.inject(INJECTOR);
      expect(injectedInjector).toBe(injector);
    });

    it('should properly instantiate dependencies', () => {
      const service = injector.inject('service');
      const depService = injector.inject('dependency');
      expect(service.dependency).toBe(depService);
      expect(depService).toBeInstanceOf(DependencyImplementation);
    });
  });

  it('should provide value', () => {
    const service = injector.inject('myValue');
    expect(service).toEqual('test');
  });

  it('should invoke onDestroy method of providers instance', () => {
    injector.inject('destroyService');
    injector.destroy();

    expect(mockDestroy).toHaveBeenCalled();
  });

  describe('factory provider', () => {
    it('should provide factory', () => {
      injector.provide({
        provide: 'myFactory',
        useFactory: () => 'testFactory',
      });

      const service = injector.inject('myFactory');
      expect(service).toEqual('testFactory');
    });

    it('should provide factory with dependencies', () => {
      injector.provide({
        provide: 'myFactory',
        useFactory: () => 'testFactory with ' + inject('myValue'),
      });

      const service = injector.inject('myFactory');
      expect(service).toEqual('testFactory with test');
    });
  });

  describe('multi token', () => {
    beforeEach(() => {
      injector.provide({
        provide: `multi*`,
        useClass: MockMultiA,
      });
      injector.provide({
        provide: `multi*`,
        useValue: 'valueA',
      });
      injector.provide({
        provide: `service*a`,
        useClass: MockMultiA,
      });
      injector.provide({
        provide: `service*b`,
        useClass: MockMultiB,
      });
      injector.provide({
        provide: `factory*a`,
        useFactory: () => 'factoryA',
      });
      injector.provide({
        provide: `factory*b`,
        useFactory: () => 'factoryB',
      });
      injector.provide({
        provide: `value*a`,
        useValue: 'valueA',
      });
      injector.provide({
        provide: `value*b`,
        useValue: 'valueB',
      });
    });

    it('should provide multi providers', () => {
      const result = injector.inject(`multi*`);

      expect(result[0]).toBeInstanceOf(MockMultiA);
      expect(result[1]).toBe('valueA');
    });

    it('should provide array of class instances', () => {
      const result = injector.inject(`service*`);
      expect(result[0]).toBeInstanceOf(MockMultiA);
      expect(result[1]).toBeInstanceOf(MockMultiB);
    });

    it('should provide array of factories results', () => {
      const result = injector.inject(`factory*`);
      expect(result[0]).toBe('factoryA');
      expect(result[1]).toBe('factoryB');
    });

    it('should provide array values', () => {
      const result = injector.inject(`value*`);
      expect(result[0]).toBe('valueA');
      expect(result[1]).toBe('valueB');
    });
  });
});
