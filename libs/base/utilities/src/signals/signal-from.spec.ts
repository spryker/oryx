import { BehaviorSubject, delay, of } from 'rxjs';
import { SignalConsumer } from './core/signals';
import { signalFrom, SignalObservable } from './signal-from';

describe('signalFrom', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a ConnectableSignal for a given observable', () => {
    const observable = of(42);
    const result = signalFrom(observable);

    expect(result).toHaveProperty('connect');
    expect(result).toHaveProperty('disconnect');
  });

  it('should connect and update the value when the async observable emits', () => {
    const observable = new BehaviorSubject(42);
    const signal = signalFrom(observable.pipe(delay(1)));
    expect(signal()).toBe(undefined);
    signal.connect();
    vi.advanceTimersByTime(1);
    expect(signal()).toBe(42);
    observable.next(43);
    vi.advanceTimersByTime(1);
    expect(signal()).toBe(43);
    signal.disconnect();
    observable.next(44);
    expect(signal()).toBe(undefined);
  });

  it('should return synchronous emission without connect', () => {
    const observable = new BehaviorSubject(42);
    const signal = signalFrom(observable);
    expect(signal()).toBe(42);
    observable.next(43);
    expect(signal()).toBe(43);
  });
});

describe('SignalObservable', () => {
  let observable: BehaviorSubject<number>;
  let signal: SignalObservable<number>;

  beforeEach(() => {
    observable = new BehaviorSubject(42);
    signal = new SignalObservable<number>(observable);
  });

  it('should not unsubscribe from the observable when only one consumer disconnects', () => {
    const consumer1 = new SignalConsumer(() => undefined);
    const consumer2 = new SignalConsumer(() => undefined);

    signal.watch(consumer1);
    signal.watch(consumer2);

    const disconnectSpy = vi.spyOn(signal, 'disconnect');
    signal.unwatch(consumer1);

    expect(disconnectSpy).toHaveBeenCalledTimes(0);
  });

  it('should unsubscribe from the observable when all consumers disconnect', () => {
    const consumer1 = new SignalConsumer(() => undefined);
    const consumer2 = new SignalConsumer(() => undefined);

    signal.watch(consumer1);
    signal.watch(consumer2);

    const disconnectSpy = vi.spyOn(signal, 'disconnect');
    signal.unwatch(consumer1);
    signal.unwatch(consumer2);

    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });

  it('should resubscribe to the observable when a consumer reconnects', () => {
    const consumer1 = new SignalConsumer(() => undefined);
    const consumer2 = new SignalConsumer(() => undefined);

    signal.watch(consumer1);
    signal.watch(consumer2);

    signal.unwatch(consumer1);
    signal.unwatch(consumer2);

    const connectSpy = vi.spyOn(signal, 'connect');
    signal.watch(consumer1);

    expect(connectSpy).toHaveBeenCalledTimes(1);
  });
});
