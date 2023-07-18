import { Mock } from 'vitest';
import { wait } from '../../misc';
import {
  Computed,
  Effect,
  SignalConsumer,
  SignalProducer,
  StateSignal,
} from './signals';

describe('SignalProducer', () => {
  let producer: SignalProducer<number>;
  let consumer: SignalConsumer;

  beforeEach(() => {
    producer = new SignalProducer<number>();
    consumer = new SignalConsumer(() => undefined);
  });

  describe('accessed', () => {
    it('should reveal the producer to the consumer', () => {
      const spy = vi.spyOn(consumer, 'reveal');
      consumer.run(() => producer.accessed());
      expect(spy).toHaveBeenCalledWith(producer);
    });

    it('should not reveal the producer when there is no consumer', () => {
      const spy = vi.spyOn(consumer, 'reveal');
      producer.accessed();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('changed', () => {
    it('should increment the version and notify all consumers', () => {
      const initialVersion = producer.version;
      const notifySpy = vi.spyOn(consumer, 'notify');

      consumer.run(() => producer.accessed());
      consumer.start();
      consumer.run(() => producer.changed());
      consumer.stop();

      expect(producer.version).toBe(initialVersion + 1);
      expect(notifySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('watch / unwatch', () => {
    it('should should notify consumer on change', () => {
      const notifySpy = vi.spyOn(consumer, 'notify');
      producer.watch(consumer);
      producer.changed();
      producer.unwatch(consumer);
      producer.changed();

      expect(notifySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('.equals()', () => {
    it('should correctly compare values using the default comparison', () => {
      const signal = new SignalProducer<number>();
      expect(signal.equals(5, 5)).toBe(true);
      expect(signal.equals(5, 10)).toBe(false);
    });

    it('should correctly compare values using a custom comparison', () => {
      const signal = new SignalProducer<number>({
        equal: (a, b) => Math.abs(a - b) <= 2,
      });
      expect(signal.equals(5, 5)).toBe(true);
      expect(signal.equals(5, 6)).toBe(true);
      expect(signal.equals(5, 8)).toBe(false);
    });
  });
});

describe('SignalConsumer', () => {
  let consumer: SignalConsumer;
  let producer: SignalProducer<number>;
  let notify: Mock;

  beforeEach(() => {
    notify = vi.fn();
    consumer = new SignalConsumer(notify);
    producer = new SignalProducer<number>();
  });

  describe('install / uninstall', () => {
    it('should pick up the producer when revealed between install and uninstall', () => {
      const notifySpy = vi.spyOn(consumer, 'notify');
      const testProducer = new SignalProducer<number>();

      consumer.install();
      testProducer.accessed();
      consumer.uninstall();

      expect(notifySpy).toHaveBeenCalledTimes(0);

      consumer.start();
      testProducer.changed();
      consumer.stop();
      expect(notifySpy).toHaveBeenCalledTimes(1);
    });

    it('should not pick up the producer when revealed outside install and uninstall', () => {
      const notifySpy = vi.spyOn(consumer, 'notify');
      const testProducer = new SignalProducer<number>();

      testProducer.accessed();

      consumer.install();
      consumer.uninstall();
      testProducer.changed();

      consumer.start();
      expect(notifySpy).toHaveBeenCalledTimes(0);
      consumer.stop();
    });
  });

  describe('run', () => {
    it('should call the provided function and return its result', () => {
      const fn = vi.fn(() => 42);
      const result = consumer.run(fn);

      expect(result).toBe(42);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should properly install and uninstall the consumer around the function call', () => {
      const installSpy = vi.spyOn(consumer, 'install');
      const uninstallSpy = vi.spyOn(consumer, 'uninstall');

      consumer.run(() => undefined);

      expect(installSpy).toHaveBeenCalledTimes(1);
      expect(uninstallSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('reveal', () => {
    it('should trigger the notify function when the producer changes if connected', () => {
      consumer.start();
      consumer.reveal(producer);
      producer.changed();

      expect(notify).toHaveBeenCalledTimes(1);
    });

    it('should not trigger the notify function when the producer changes if not connected', () => {
      consumer.reveal(producer);
      producer.changed();

      expect(notify).toHaveBeenCalledTimes(0);
    });

    it('should make the consumer stale when the producer changes if not connected', () => {
      consumer.reveal(producer);
      producer.changed();

      expect(consumer.isStale()).toBe(true);
    });
  });

  describe('isStale', () => {
    it('should return true when any version is not equal to the corresponding producer version', () => {
      consumer.reveal(producer);
      producer.changed();

      expect(consumer.isStale()).toBe(true);
    });

    it('should return false when all versions match the corresponding producer versions', () => {
      consumer.reveal(producer);

      expect(consumer.isStale()).toBe(false);
    });
  });

  describe('start / stop', () => {
    it('should watch all producers when starting and not already connected', () => {
      const watchSpy = vi.spyOn(producer, 'watch');
      consumer.reveal(producer);
      consumer.start();

      expect(consumer.isConnected).toBe(true);
      expect(watchSpy).toHaveBeenCalledTimes(1);
    });

    it('should unwatch all producers when stopping and connected', () => {
      const unwatchSpy = vi.spyOn(producer, 'unwatch');
      consumer.reveal(producer);
      consumer.start();
      consumer.stop();

      expect(consumer.isConnected).toBe(false);
      expect(unwatchSpy).toHaveBeenCalledTimes(1);
    });

    it('should not watch the producers when starting if already connected', () => {
      const watchSpy = vi.spyOn(producer, 'watch');
      consumer.reveal(producer);
      consumer.start();
      watchSpy.mockClear();
      consumer.start();

      expect(watchSpy).toHaveBeenCalledTimes(0);
    });

    it('should not unwatch the producers when stopping if not connected', () => {
      const unwatchSpy = vi.spyOn(producer, 'unwatch');
      consumer.reveal(producer);
      consumer.stop();

      expect(unwatchSpy).toHaveBeenCalledTimes(0);
    });
  });
});

describe('StateSignal', () => {
  let stateSignal: StateSignal<number>;

  beforeEach(() => {
    stateSignal = new StateSignal(0);
  });

  describe('set', () => {
    it('should update the state and call changed when the new value is different', () => {
      const changedSpy = vi.spyOn(stateSignal, 'changed');

      stateSignal.set(1);

      expect(stateSignal.value).toBe(1);
      expect(changedSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call changed when the new value is the same', () => {
      const changedSpy = vi.spyOn(stateSignal, 'changed');

      stateSignal.set(0);

      expect(changedSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('value', () => {
    it('should call accessed and return the current state', () => {
      const accessedSpy = vi.spyOn(stateSignal, 'accessed');

      const result = stateSignal.value;

      expect(result).toBe(0);
      expect(accessedSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('StateSignal', () => {
    it('should trigger a change notification when state changes according to a custom comparison', () => {
      const stateSignal = new StateSignal<number>(5, {
        equal: (a, b) => Math.abs(a - b) <= 2,
      });
      let testValue: number | undefined;

      const eff = new Effect(() => {
        testValue = stateSignal.value;
      });

      expect(testValue).toBe(5);
      stateSignal.set(6);
      expect(testValue).toBe(5); // change within tolerance, so no change notification

      stateSignal.set(9);
      expect(testValue).toBe(9); // change outside tolerance, so a change notification is expected
      eff.stop();
    });
  });
});

describe('Computed', () => {
  let computed: Computed<number>;
  let stateSignal: StateSignal<number>;

  beforeEach(() => {
    stateSignal = new StateSignal(0);
    computed = new Computed(() => stateSignal.value * 2);
  });

  describe('value', () => {
    it('should call accessed, compute and return the computed result', () => {
      const accessedSpy = vi.spyOn(computed, 'accessed');
      const computeSpy = vi.spyOn(computed, 'compute');

      const result = computed.value;

      expect(result).toBe(0);
      expect(accessedSpy).toHaveBeenCalledTimes(1);
      expect(computeSpy).toHaveBeenCalledTimes(1);
    });

    it('should recompute only when the stateSignal has changed', () => {
      const computeSpy = vi.spyOn(computed, 'compute');

      computed.value;
      computed.value;

      expect(computeSpy).toHaveBeenCalledTimes(1);

      stateSignal.set(1);

      computed.value;

      expect(computeSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('should trigger a change notification when computed value changes according to a custom comparison', () => {
    const state = new StateSignal<number>(5);
    const computed = new Computed<number>(() => state.value, {
      equal: (a, b) => Math.abs(a - b) <= 2,
    });

    let testValue: number | undefined;

    const eff = new Effect(() => {
      testValue = computed.value * 2;
    });

    expect(testValue).toBe(10);
    state.set(6);
    expect(testValue).toBe(10); // change within tolerance, so no change notification

    state.set(9);
    expect(testValue).toBe(18); // change within tolerance, so no change notification

    eff.stop();
  });
});

describe('Effect', () => {
  let effect: Effect;
  let effectFn: Mock;
  let stateSignal: StateSignal<number>;

  beforeEach(() => {
    stateSignal = new StateSignal(0);
    effectFn = vi.fn(() => stateSignal.value);
    effect = new Effect(effectFn);
  });

  describe('run', () => {
    it('should call the effect function', () => {
      stateSignal.set(1);
      expect(effectFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('start', () => {
    it('should call run and start the consumer if not connected', () => {
      effect.stop(); // Ensure it's stopped
      effect.start();

      stateSignal.set(1);

      expect(effectFn).toHaveBeenCalledTimes(3);
    });
  });

  describe('stop', () => {
    it('should stop the effect from rerunning when the signal changes', () => {
      effect.stop();
      stateSignal.set(1);

      expect(effectFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('EffectOptions', () => {
    describe('defer', () => {
      it('should not call the effect function upon initialization if defer is true', () => {
        effectFn = vi.fn(() => stateSignal.value);
        effect = new Effect(effectFn, { defer: true });

        expect(effectFn).toHaveBeenCalledTimes(0);
      });

      it('should call the effect function upon initialization if defer is false', () => {
        effectFn = vi.fn(() => stateSignal.value);
        effect = new Effect(effectFn, { defer: false });

        expect(effectFn).toHaveBeenCalledTimes(1);
      });
    });

    describe('async', () => {
      it('should call the effect function asynchronously if async is true', async () => {
        effectFn = vi.fn(() => stateSignal.value);
        effect = new Effect(effectFn, { async: true });

        expect(effectFn).toHaveBeenCalledTimes(0);
        await wait(10);
        expect(effectFn).toHaveBeenCalledTimes(1);
        stateSignal.set(1);
        expect(effectFn).toHaveBeenCalledTimes(1);
        await wait(10);
        expect(effectFn).toHaveBeenCalledTimes(2);
      });

      it('should call the effect function synchronously if async is false', () => {
        effectFn = vi.fn(() => stateSignal.value);
        effect = new Effect(effectFn, { async: false });

        stateSignal.set(1);

        expect(effectFn).toHaveBeenCalledTimes(2);
      });
    });
  });
});

describe('nested computed inside effect with conditional', () => {
  let signal1: StateSignal<boolean>;
  let signal3: StateSignal<number>;
  let cmp: Computed<number>;
  let effectFn: Mock;
  let effect: Effect;
  let value: number | undefined;

  beforeEach(() => {
    signal1 = new StateSignal<boolean>(false);
    signal3 = new StateSignal<number>(0);
    cmp = new Computed(() => signal3.value);
    effectFn = vi.fn(() => {
      if (signal1.value) {
        value = cmp.value;
      } else value = -1;
    });
    effect = new Effect(effectFn);
  });

  afterEach(() => {
    effect.stop();
  });

  it('should react to signal3 changes when signal1 is true, then false, then true again', () => {
    expect(effectFn).toHaveBeenCalledTimes(1);
    expect(value).toBe(-1);

    // Set signal1 to true, so the effect reacts to signal3 changes
    signal1.set(true);
    expect(effectFn).toHaveBeenCalledTimes(2); /// ????
    expect(value).toBe(0);

    signal3.set(2);
    expect(effectFn).toHaveBeenCalledTimes(3);
    expect(value).toBe(2);

    // Set signal1 to false, so the effect stops reacting to signal3 changes
    signal1.set(false);
    expect(effectFn).toHaveBeenCalledTimes(4);
    expect(value).toBe(-1);

    signal3.set(3);
    expect(effectFn).toHaveBeenCalledTimes(4);
    expect(value).toBe(-1);

    signal1.set(true);
    expect(effectFn).toHaveBeenCalledTimes(5);
    expect(value).toBe(3);

    signal3.set(4);
    expect(effectFn).toHaveBeenCalledTimes(6);
    expect(value).toBe(4);
  });
});

describe('nested computed inside effect with two levels and conditionals', () => {
  let signal1: StateSignal<boolean>;
  let signal2: StateSignal<boolean>;
  let signal3: StateSignal<number>;
  let cmp1: Computed<number>;
  let cmp2: Computed<number>;
  let effectFn: Mock;
  let effect: Effect;
  let value: number | undefined;

  beforeEach(() => {
    signal1 = new StateSignal<boolean>(false);
    signal2 = new StateSignal<boolean>(false);
    signal3 = new StateSignal<number>(0);
    cmp1 = new Computed(() => signal3.value * 2);
    cmp2 = new Computed(() => signal3.value * 3);
    effectFn = vi.fn(() => {
      if (signal1.value) {
        value = cmp1.value;
      } else if (signal2.value) {
        value = cmp2.value;
      } else {
        value = -1;
      }
    });
    effect = new Effect(effectFn);
  });

  afterEach(() => {
    effect.stop();
  });

  it('should react to signal3 changes and conditionally use nested computed signals', () => {
    expect(effectFn).toHaveBeenCalledTimes(1);
    expect(value).toBe(-1);

    // Set signal1 to true, so the effect reacts to signal3 changes using cmp1
    signal1.set(true);
    expect(effectFn).toHaveBeenCalledTimes(2);
    expect(value).toBe(0);

    signal3.set(2);
    expect(effectFn).toHaveBeenCalledTimes(3);
    expect(value).toBe(4);

    // Set signal1 to false, and signal2 to true, so the effect reacts to signal3 changes using cmp2
    signal1.set(false);
    signal2.set(true);
    expect(effectFn).toHaveBeenCalledTimes(5);
    expect(value).toBe(6);

    signal3.set(3);
    expect(effectFn).toHaveBeenCalledTimes(6);
    expect(value).toBe(9);

    // Set signal2 to false, so the effect does not react to signal3 changes
    signal2.set(false);
    expect(effectFn).toHaveBeenCalledTimes(7);
    expect(value).toBe(-1);

    signal3.set(4);
    expect(effectFn).toHaveBeenCalledTimes(7);
    expect(value).toBe(-1);
  });
});
