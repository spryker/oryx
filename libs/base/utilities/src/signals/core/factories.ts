import { Computed, Effect, StateSignal } from './signals';

export interface Signal<T = unknown> {
  (): T;
  version: number;
}

export interface SettableSignal<T = unknown> extends Signal<T> {
  set: (value: T) => void;
}

export function createSignal<T = unknown>(initialValue: T): SettableSignal<T> {
  const coreSignal = new StateSignal(initialValue);

  // const signal = Object.assign(() => coreSignal.value, coreSignal);

  const signal = () => coreSignal.value;
  signal.set = (value: T) => coreSignal.set(value);

  return signal as SettableSignal<T>;
}

export function computed<T>(computation: () => T): Signal<T> {
  const coreComputed = new Computed(computation);
  const computed = () => coreComputed.value;

  return computed as Signal<T>;
}

export function effect(fn: () => void): Effect {
  return new Effect(fn);
}
