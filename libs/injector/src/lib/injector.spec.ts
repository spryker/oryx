import { inject } from './inject';
import { Injector } from './injector';

class MockImplementation {
  dependency = inject('dependency');
}
class DependencyImplementation {}

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
  });

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
