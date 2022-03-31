import { inject, setCurrentInjector } from './inject';
import { Injector } from './injector';

class MockService {}

describe('inject', () => {
  it('should throw error if used outside of injection context', () => {
    expect(() => inject('')).toThrow();
  });

  it('should use injector context provided by setCurrentInjector', () => {
    const reset = setCurrentInjector(
      new Injector([
        {
          provide: '',
          useClass: MockService,
        },
      ])
    );
    expect(() => inject('')).not.toThrow();
    expect(inject('')).toBeInstanceOf(MockService);
    reset();
  });

  it('setCurrentInjector should return cleanup function', () => {
    expect(() => inject('')).toThrow();
    const reset = setCurrentInjector(
      new Injector([
        {
          provide: '',
          useClass: MockService,
        },
      ])
    );
    expect(() => inject('')).not.toThrow();
    reset();
    expect(() => inject('')).toThrow();
  });

  it('should use default value if dependency is not injected', () => {
    setCurrentInjector(
      new Injector([
        {
          provide: '',
          useClass: MockService,
        },
      ])
    );
    const defaultValue = 'defaultValue';
    expect(inject('notInjected', defaultValue)).toEqual(defaultValue);
  });
});
