import { inject } from './inject';
import { Injector } from './injector';

const mockDestroy = vi.fn();

class MockImplementation {
  dependency = inject('dependency');
}
class DependencyImplementation {}
class ServiceWithDestroy {
  onDestroy() {
    mockDestroy();
  }
}

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
});
