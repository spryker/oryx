/**
 * A simple container that allows to:
 *
 * - Invert dependencies
 * - Provide default implementation
 * - Swap implementation at runtime
 * - Share implementation across global container (globalThis by default)
 *
 * If the default implementation was not provided and `inject()` was not called at least once
 * then `get()` calls would always throw as there is no implementation provided for container.
 *
 * @example
 * - First create an injectable for your interface with key and default implementation:
 * ```ts
 * const myInjectable = new Injectable<MyInterface>('my-key', new MyDefaultImpl());
 * ```
 *
 * - Then use injectable to depend on your interface:
 * ```ts
 * doSomethingWith(myInjectable.get())
 *
 * ```
 * - Then you can inject alternative implementation from somewhere else:
 * ```ts
 * myInjectable.inject(new MyAnotherImpl())
 * ```
 * You can always request the same injectable from another place by key:
 * ```ts
 * myAnotherInjectable = new Injectable<MyInterface>('my-key');
 * myAnotherInjectable.get();
 * ```
 */
export class Injectable<T> {
  static GlobalKey = Symbol.for('oryx.Injectable');

  protected key;

  constructor(
    key: string,
    defaultValue?: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected container: Record<symbol, unknown> = (globalThis as any)[
      Injectable.GlobalKey
    ] ?? ((globalThis as any)[Injectable.GlobalKey] = {})
  ) {
    this.key = Symbol.for(key);

    if (defaultValue !== undefined) {
      this.inject(defaultValue);
    }
  }

  /**
   * Get current implmentation of the Injectable container.
   *
   * @throws If default value was not provided
   * and {@link Injectable.inject()} method was never called
   */
  get(): T {
    const value = this.container[this.key];

    if (value === undefined) {
      throw new Error(
        `Injectable: Value for ${String(this.key)} was not provided!`
      );
    }

    return value as T;
  }

  /**
   * Inject a new implementation into the Injectable container.
   */
  inject(value: T): void {
    this.container[this.key] = value;
  }
}
