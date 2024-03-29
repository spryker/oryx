import {
  Computed,
  Effect,
  EffectOptions,
  SignalOptions,
  StateSignal,
} from './signals';

export interface Signal<T = unknown> {
  (): T;
  version: number;
  valueOf(): T;
}

export interface SettableSignal<T = unknown> extends Signal<T> {
  set: (value: T) => void;
}

export function createSignal<T = unknown>(
  initialValue: T,
  options?: SignalOptions<T>
): SettableSignal<T> {
  const instance = new StateSignal(initialValue, options);

  const signal = () => instance.value;
  signal.set = (value: T) => instance.set(value);
  signal.valueOf = () => instance.value;
  signal.toString = () => String(instance.value);

  return signal as SettableSignal<T>;
}

export function computed<T>(
  computation: () => T,
  options?: SignalOptions<T>
): Signal<T> {
  const instance = new Computed(computation, options);

  const computed = () => instance.value;
  computed.valueOf = () => instance.value;
  computed.toString = () => String(instance.value);

  return computed as Signal<T>;
}

export function effect(fn: () => void, options?: EffectOptions): Effect {
  return new Effect(fn, options);
}
