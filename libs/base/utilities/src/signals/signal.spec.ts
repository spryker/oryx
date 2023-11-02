import { BehaviorSubject, interval, of } from 'rxjs';
import { computed, effect, signal } from './signal';

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

describe('computed', () => {
  it('should return a Signal for a non-observable value', () => {
    const value = 42;
    const result = computed(() => value);
    expect(result()).toBe(value);
  });

  it('should return a Signal for an observable value', () => {
    const value = 42;
    const result = computed(() => of(value));
    expect(result()).toBe(value);
  });

  it('should react to changes in the observable value', () => {
    const observable = new BehaviorSubject(1);
    const result = computed(() => observable);

    const values = [1, 2, 3];

    const results: any[] = [];

    const ef = effect(() => {
      results.push(result());
    });

    while (results.length < values.length) {
      observable.next(values[results.length]);
    }
    ef.stop();
    expect(results).toEqual(values);
  });

  describe('async observables in computed', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create a computed with a signal-based input', () => {
      const period = signal(100);
      const c = computed(() => interval(period()));

      const values: any[] = [];
      const maxValues = 3;

      const ef = effect(() => {
        values.push(c());
      });

      vi.advanceTimersByTime(100 * maxValues);

      expect(values.length).toBe(maxValues + 1);
      expect(values).toEqual([undefined, 0, 1, 2]);

      period.set(50);
      vi.advanceTimersByTime(100 * maxValues);

      expect(values).toEqual([undefined, 0, 1, 2, 2, 0, 1, 2, 3, 4, 5]);

      ef.stop();
    });
  });
});
