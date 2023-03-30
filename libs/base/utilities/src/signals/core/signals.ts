let currentConsumer: SignalConsumer | undefined = undefined;

export class SignalProducer<T> {
  version = 0;
  protected consumers = new Set<SignalConsumer>();

  accessed(): void {
    currentConsumer?.reveal(this);
  }

  changed(): void {
    this.version++;
    for (const consumer of this.consumers) {
      consumer.notify();
    }
  }

  watch(sniffer: SignalConsumer): void {
    this.consumers.add(sniffer);
  }

  unwatch(sniffer: SignalConsumer): void {
    this.consumers.delete(sniffer);
  }
}

export class SignalConsumer {
  protected versions = new Map<SignalProducer<any>, number>();
  protected unusedVersions: Map<SignalProducer<any>, unknown> | undefined;
  protected prev: any;
  public isConnected = false;

  constructor(public notify: () => void) {}

  install(): void {
    this.prev = currentConsumer;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    currentConsumer = this;

    if (this.isConnected) {
      this.unusedVersions = this.versions;
      this.versions = new Map();
    } else {
      this.versions.clear();
    }
  }

  uninstall(): void {
    currentConsumer = this.prev;
    this.prev = undefined;

    if (this.isConnected) {
      for (const producer of this.unusedVersions!.keys()) {
        producer.unwatch(this);
      }
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
      if (!this.unusedVersions!.has(producer) && !this.versions.has(producer)) {
        producer.watch(this);
      }
      this.unusedVersions?.delete(producer);
    }
    this.versions.set(producer, producer.version);
  }

  isStale(): boolean {
    for (const [signal, version] of this.versions) {
      if (version !== signal.version) {
        return true;
      }
    }
    return false;
  }

  start(): void {
    if (!this.isConnected) {
      this.isConnected = true;

      for (const [signal] of this.versions) {
        signal.watch(this);
      }
    }
  }

  stop(): void {
    if (this.isConnected) {
      this.isConnected = false;

      for (const signal of this.versions.keys()) {
        signal.unwatch(this);
      }
    }
  }
}

export class StateSignal<T> extends SignalProducer<T> {
  protected state: T;

  constructor(protected initialValue: T) {
    super();
    this.state = initialValue;
  }

  set(value: T): void {
    if (value !== this.state) {
      this.state = value;
      this.changed();
    }
  }

  get value(): T {
    this.accessed();
    return this.state;
  }
}

export class Computed<T> extends SignalProducer<T> {
  protected result!: T;

  protected consumer = new SignalConsumer(() => this.compute());

  constructor(protected computation: () => T) {
    super();
    this.version = -1;
  }

  get value(): T {
    this.accessed();
    if (
      this.version < 0 ||
      (!this.consumer.isConnected && this.consumer.isStale())
    ) {
      this.compute();
    }
    return this.result;
  }

  compute(): void {
    const newValue = this.consumer.run(() => this.computation());

    if (this.result !== newValue) {
      this.result = newValue;
      this.version++;
      this.changed();
    }
  }

  watch(consumer: SignalConsumer): void {
    super.watch(consumer);
    if (this.consumers.size === 1) {
      if (this.consumer.isStale()) {
        this.compute();
      }
      this.consumer.start();
    }
  }

  unwatch(consumer: SignalConsumer): void {
    super.unwatch(consumer);
    if (this.consumers.size === 0) {
      this.consumer.stop();
    }
  }
}

export class Effect {
  protected consumer = new SignalConsumer(() => this.run());

  constructor(protected effect: () => void) {
    this.start();
  }

  protected run(): void {
    this.consumer.run(this.effect);
  }

  start(): void {
    if (!this.consumer.isConnected) {
      this.run();
      this.consumer.start();
    }
  }

  stop(): void {
    this.consumer.stop();
  }
}
