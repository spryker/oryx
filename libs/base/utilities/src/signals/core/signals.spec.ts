import { Mock } from 'vitest';
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
    consumer = new SignalConsumer(() => {});
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
});
