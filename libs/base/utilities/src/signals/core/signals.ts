let currentConsumer: SignalConsumer | undefined = undefined;

export interface SignalOptions<T> {
  equal?: (a: T, b: T) => boolean;
}

/**
 *
 *  SignalProducer represents a data source that can emit signals when its underlying value changes.
 *  It is responsible for managing the list of subscribed consumers and notifying them of changes to the data.
 *
 *  Responsibilities:
 *  1. Maintain a list of consumers: SignalProducer maintains a set of subscribed consumers.
 *  2. Access tracking: The accessed() method is called whenever a consumer accesses the value of a SignalProducer.
 *  3. Change notification: The changed() method is called when the underlying data of the SignalProducer changes.
 *  4. Consumer subscription management: The watch() and unwatch() methods are used to manage the subscription of consumers.
 */
export class SignalProducer<T> {
  version = 0;
  protected consumers = new Set<SignalConsumer>();

  constructor(protected options: SignalOptions<T> = {}) {}

  equals(a: T, b: T): boolean {
    return this.options.equal ? this.options.equal(a, b) : a === b;
  }

  accessed(): void {
    currentConsumer?.reveal(this);
  }

  changed(): void {
    this.version++;
    for (const consumer of this.consumers) consumer.notify();
  }

  watch(sniffer: SignalConsumer): void {
    this.consumers.add(sniffer);
  }

  unwatch(sniffer: SignalConsumer): void {
    this.consumers.delete(sniffer);
  }
}

/**
 SignalConsumer manages connections to SignalProducer objects and responds to their data changes:

 1. Tracks producers: Maintains a map of connected SignalProducer objects and their version numbers.
 2. Manages connections: Connects to producers when their data is accessed, ensuring notifications are received.
 3. Detects stale data: Checks for version mismatches to determine if a consumer needs to react to changes.
 4. Handles notifications: Reacts to producer data changes using the provided notify() function.
 5. Controls connection lifecycle: Connects and disconnects from producers using start(), and stop() methods.
 6. Detecting producers: Runs a computation with producers detection using the run() or install()/uninstall() methods.
 */
export class SignalConsumer {
  protected versions = new Map<SignalProducer<any>, number>();
  protected unusedVersions: Map<SignalProducer<any>, unknown> | undefined;
  protected prev: SignalConsumer | undefined;
  public isConnected = false;

  constructor(public notify: () => void) {}

  install(): void {
    this.prev = currentConsumer;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    currentConsumer = this;

    if (this.isConnected) {
      this.unusedVersions = this.versions;
      this.versions = new Map();
    } else this.versions.clear();
  }

  uninstall(): void {
    currentConsumer = this.prev;
    this.prev = undefined;

    if (this.isConnected && this.unusedVersions) {
      for (const producer of this.unusedVersions.keys()) producer.unwatch(this);

      this.unusedVersions = undefined;
    }
  }

  run<T>(fn: () => T): T {
    this.install();
    const result = fn();
    this.uninstall();

    return result;
  }

  reveal(producer: SignalProducer<any>): void {
    if (this.isConnected) {
      if (!this.unusedVersions?.has(producer) && !this.versions.has(producer))
        producer.watch(this);

      this.unusedVersions?.delete(producer);
    }
    this.versions.set(producer, producer.version);
  }

  isStale(): boolean {
    for (const [signal, version] of this.versions) {
      if (version !== signal.version) return true;
    }
    return false;
  }

  start(): void {
    if (!this.isConnected) {
      this.isConnected = true;

      if (this.isStale()) this.notify();

      for (const signal of this.versions.keys()) signal.watch(this);
    }
  }

  stop(): void {
    if (this.isConnected) {
      this.isConnected = false;

      for (const signal of this.versions.keys()) signal.unwatch(this);
    }
  }
}

/**
 * StateSignal:
 *
 * 1. Maintains state.
 * 2. Uses the set() method to update the state and triggers change notifications.
 * 3. Exposes the state value through the value getter, registering data access.
 */
export class StateSignal<T> extends SignalProducer<T> {
  protected state: T;

  constructor(protected initialValue: T, options?: SignalOptions<T>) {
    super(options);
    this.state = initialValue;
  }

  set(value: T): void {
    if (!this.equals(value, this.state)) {
      this.state = value;
      this.changed();
    }
  }

  get value(): T {
    this.accessed();
    return this.state;
  }
}

/**
 * Computed:
 *
 * 1. Stores computation, holds a computation function.
 * 2. Utilizes a SignalConsumer to track and update its dependencies.
 * 3. Recalculates the result when dependencies change or when value is accessed, but stale.
 */
export class Computed<T> extends SignalProducer<T> {
  protected result!: T;

  protected consumer = new SignalConsumer(() => this.compute());

  constructor(protected computation: () => T, options?: SignalOptions<T>) {
    super(options);
    this.version = -1;
  }

  get value(): T {
    this.accessed();
    if (
      this.version < 0 ||
      (!this.consumer.isConnected && this.consumer.isStale())
    )
      this.compute(false);

    return this.result;
  }

  compute(notify = true): void {
    const newValue = this.consumer.run(() => this.computation());

    if (!this.equals(this.result, newValue)) {
      this.result = newValue;
      this.version++;
      if (notify) this.changed();
    }
  }

  watch(consumer: SignalConsumer): void {
    super.watch(consumer);
    if (!this.consumer.isConnected) {
      if (this.consumer.isStale()) this.compute(false);

      this.consumer.start();
    }
  }

  unwatch(consumer: SignalConsumer): void {
    super.unwatch(consumer);
    if (this.consumers.size === 0) this.consumer.stop();
  }
}

export interface EffectOptions {
  /**
   * If true, the effect will not run until the start() method is called.
   */
  defer?: boolean;
  /**
   * If true, the effect will be run asynchronously
   */
  async?: boolean;
}

/**
 * Effect:
 *
 * 1. Runs side effects: Holds an effect function to be executed in response to dependency changes.
 * 2. Manages dependencies: Utilizes a SignalConsumer to track and update its dependencies.
 * 3. Executes effect: Runs the effect function when dependencies change.
 * 4. Controls lifecycle: Starts and stops the effect with start() and stop() methods.
 */
export class Effect {
  protected consumer = new SignalConsumer(() => this.run());
  protected asyncScheduled?: boolean;

  constructor(
    protected effect: () => void,
    protected options: EffectOptions = {}
  ) {
    if (!options.defer) this.start();
  }

  protected run(): void {
    if (this.options.async) {
      if (!this.asyncScheduled) {
        this.asyncScheduled = true;
        queueMicrotask(() => {
          this.asyncScheduled = false;
          this.consumer.run(this.effect);
        });
      }
    } else this.consumer.run(this.effect);
  }

  start(): void {
    if (!this.consumer.isConnected) {
      this.consumer.start();
      this.run();
    }
  }

  stop(): void {
    this.consumer.stop();
  }
}
