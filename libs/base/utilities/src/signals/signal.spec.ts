import { of } from 'rxjs';
import { signal } from './signal';

describe('signal', () => {
  it('should return a SettableSignal for a non-observable value', () => {
    const value = 42;
    const result = signal(value);
    expect(result()).toBe(value);
  });

  it('should return a ConnectableSignal for an observable value', () => {
    const observable = of(42);
    const result = signal(observable);

    expect(result.connect).toBeDefined();
  });
});
