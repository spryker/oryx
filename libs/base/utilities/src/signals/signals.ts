export type Signal<T = unknown> = {
  (): T;
  set: (value: T) => void;
  subscribe(callback: (value: T) => void): () => void;
  version: number;
};

export type Computed<T> = {
  (): T;
  subscribe(callback: (value: T) => void): () => void;
  compute(): void;
  version: number;
};

export interface SignalSniffer {
  reveal(signal: Signal<any> | Computed<any>): void;
  installed?(): void;
  uninstalled?(): void;
}

let _signalSniffer: SignalSniffer | undefined = undefined;

export function installSignalSniffer(sniffer: SignalSniffer): () => void {
  const previous = _signalSniffer;
  _signalSniffer = sniffer;
  sniffer.installed?.();
  return (): void => {
    _signalSniffer = previous;
    sniffer.uninstalled?.();
  };
}

export function createSignal<T = unknown>(initialValue: T): Signal<T> {
  let state: T = initialValue;

  const subscribers = new Map<any, any>();

  const signal: Signal<T> = function () {
    _signalSniffer?.reveal(signal);
    return state;
  };

  signal.version = 0;
  signal.set = (value: T) => {
    if (value !== state) {
      signal.version++;
      state = value;
      for (const callback of subscribers.values()) {
        callback(value);
      }
    }
  };

  signal.subscribe = (callback: (value: T) => void) => {
    const subId = Symbol();
    subscribers.set(subId, callback);
    console.log('subscribed', state);
    return () => {
      console.log('unsubscribed', state);
      subscribers.delete(subId);
    };
  };

  return signal;
}

export class ComputedSignalSniffer implements SignalSniffer {
  protected subscriptions = new Map<Signal<any>, (() => void) | undefined>();
  protected versions = new Map<Signal<any>, number>();
  protected unusedSignals: Set<Signal<any>> | undefined;

  protected isConnected = false;

  constructor(protected computed: Computed<unknown>) {}

  reveal(signal: Signal<any>): void {
    this.unusedSignals?.delete(signal);
    if (this.isConnected) {
      if (!this.subscriptions.has(signal)) {
        this.subscriptions.set(signal, signal.subscribe(this.update));
      }
    }
    this.versions.set(signal, signal.version);
  }

  installed(): void {
    this.unusedSignals = new Set(this.subscriptions.keys());
  }

  uninstalled(): void {
    for (const signal of this.unusedSignals!) {
      if (this.isConnected) {
        this.subscriptions.get(signal)?.();
        this.subscriptions.delete(signal);
      }
      this.versions.delete(signal);
    }
    this.unusedSignals = undefined;
  }

  update = () => {
    this.computed.compute();
  };

  start(): void {
    this.isConnected = true;
    if (this.shouldRecompute()) {
      this.computed.compute();
    }
    // recompute if needed (versions have changed)
  }

  stop(): void {
    this.isConnected = false;
    for (const dispose of this.subscriptions.values()) {
      dispose?.();
    }
    this.subscriptions.clear();
  }

  shouldRecompute(): boolean {
    for (const [signal, version] of this.versions) {
      if (version !== signal.version) {
        return true;
      }
    }
    return false;
  }
}

/*
computed:
  runs the computation on first access

  if not subscribed, it will recheck dependencies on every access, but recalculate only if a dependency has changed

  if subscribed, it will subscribe to all signals used in the computation
  if unsubscribed, it will unsubscribe from all signals used in the computation
 */

export function computed<T>(computation: () => T): Computed<T> {
  const subscribers = new Map<any, any>();

  let value!: T;

  const compute = () => {
    console.log('computing', value);
    const uninstall = installSignalSniffer(signalSniffer);
    const newValue = computation();
    uninstall();
    if (value !== newValue) {
      value = newValue;
      computed.version++;
      for (const callback of subscribers.values()) {
        callback(value);
      }
    }
  };

  const computed: Computed<T> = function () {
    _signalSniffer?.reveal(computed);
    if (
      computed.version < 0 ||
      (subscribers.size === 0 && signalSniffer.shouldRecompute())
    ) {
      compute();
    }
    return value;
  };
  computed.version = -1;
  computed.subscribe = (callback: (value: T) => void) => {
    const subId = Symbol();
    subscribers.set(subId, callback);

    if (subscribers.size === 1) {
      signalSniffer.start();
    }

    return () => {
      subscribers.delete(subId);
      if (subscribers.size === 0) {
        signalSniffer.stop();
      }
    };
  };
  computed.compute = compute;

  const signalSniffer = new ComputedSignalSniffer(computed);

  return computed;
}

/*


ability to pass comparision function, why not? :)



let currentParent = undefined;


parent {
    notify()
}



createSignal(state = undefined) {

    const parent = currentParent;

    let state = initialState;

    return function() {
        // accesing the signal
        this.parent?.notify(me)
        return state;
    }
}



parrent





API


const counter = createSingal()

counter()
counter.set()


counter.subscribe()

---

let parentObsever: undefined;

class ParentOberver {

    notifiers: [];
    oldNotifiers: []

    notify(value) {
        this.notifiers.push(value)
    }

    onConnected() {

        this.notifiers.forEach(subscribe(
            () => {
                this.host.requestUpdate();
                this.notifiers = [];
                this.oldNotifiers = this.notifiers;

                setTimeout() {
                    this.oldNotifiers.forEach(unsubscribe);
                    this.oldNotifiers = [];
                }
            }
        ))

    }

    onDisconnected() {

        this.notifiers.forEach(unsubscribe())
        this.notifiers = [];
    }

}



function createSignal(initialState = undefined) {

    const state$ = new BehaviorSubject(initialState);

    const signal = function() {

        parentObserver.notify(state$);

        return state$.value;
    }

    signal.set = (newValue) => {
        state$.next(newValue)
    }

    signal.subscribe = () => {

    }

    return signal;
}






function createSignal(initialState = undefined) {

    const state$ = initialState;

    const subscribers = Set();

    const signal = function() {

        parentObserver?.notify(signal);

        return state$.value;
    }

    signal.set = (newValue) => {
        if (state !== newValue) {
            state = newValue;

            for (subscriber of subscribers) {
                subscriber(newValue);
            }
        }
    }

    signal.subscribe = (callback) => {
        subscribers.add[callback];

        return () => {
            subscribers.delete(callback);
        }
    }

    return signal;
}


function computed(computation: () => {}) {

    const parent = currentParent;

    setupComputerParentObserver()
    let valule = computation();
    removeComputedParentObserver();

    const computed  = function() {
        parentObserver?.notify()
        return value;
    };


    onNotify() {

        if (state !== newValue) {
            state = newValue;

            for (subscriber of subscribers) {
                subscriber(newValue);
            }
        }

    }




    return computed;

}




signal(5);
signal.subscribe(x => console.log('signal', x));

console.log(signal());

signal.set(6);

console.log(signal());

const double = computed(() => singnal() * 2);

console.log(double());

















/*

we just inform about signals being used the parent context

and this context can then decide about subscribing to the signals,
and signals exists forever.



usage of signal has to be synchronous. if we use signals in context,
we can detect dependencies and if we want,
we can subsribe to those dependcies and listen for changes.



so, signal is signal, and it only informs externals about read, nothing more.
besides that, they can allow to subscribe to changes. And that's it!

*/
