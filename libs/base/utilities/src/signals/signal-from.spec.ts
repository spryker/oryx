import { BehaviorSubject, of } from 'rxjs';
import { signalFrom } from './signal-from';

describe('signalFrom', () => {
  it('should return a ConnectableSignal for a given observable', () => {
    const observable = of(42);
    const result = signalFrom(observable);

    expect(result).toHaveProperty('connect');
    expect(result).toHaveProperty('disconnect');
  });

  it('should connect and update the value when the observable emits', () => {
    const observable = new BehaviorSubject(42);
    const signal = signalFrom(observable);
    expect(signal()).toBeUndefined();
    signal.connect();
    expect(signal()).toBe(42);
    observable.next(43);
    expect(signal()).toBe(43);
    signal.disconnect();
    observable.next(44);
    expect(signal()).toBe(43);
  });
});
