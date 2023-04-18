import { computed, createSignal, effect } from './factories';

describe('createSignal', () => {
  it('should create a signal with initial value', () => {
    const signal = createSignal(5);
    expect(signal()).toBe(5);
  });

  it('should set and get the value of the signal', () => {
    const signal = createSignal(0);
    signal.set(10);
    expect(signal()).toBe(10);
  });
});

describe('computed', () => {
  it('should create a computed value based on signals', () => {
    const a = createSignal(1);
    const b = createSignal(2);
    const c = computed(() => a() + b());

    expect(c()).toBe(3);
  });

  it('should update computed value when dependencies change', () => {
    const a = createSignal(1);
    const b = createSignal(2);
    const c = computed(() => a() + b());
    expect(c()).toBe(3);
    a.set(3);
    expect(c()).toBe(5);
  });
});

describe('effect', () => {
  it('should run the effect immediately when created', () => {
    let executed = false;
    effect(() => {
      executed = true;
    });
    expect(executed).toBe(true);
  });

  it('should run the effect when its dependency changes', () => {
    const a = createSignal(1);
    let executionCount = 0;
    const cancelEffect = effect(() => {
      executionCount++;
      a();
    });

    a.set(2);
    expect(executionCount).toBe(2);

    // Clean up the effect
    cancelEffect.stop();
  });

  it('should stop running the effect when stopped', () => {
    const a = createSignal(1);
    let executionCount = 0;
    const cancelEffect = effect(() => {
      executionCount++;
      a();
    });

    a.set(2);
    cancelEffect.stop();
    a.set(3);
    expect(executionCount).toBe(2);
  });
});

describe('diamond dependency', () => {
  it('should handle diamond dependencies correctly', () => {
    const a = createSignal(1);
    const b = createSignal(2);

    const c = computed(() => a() * 2); // 2
    const d = computed(() => b() * 3); // 6

    const e = computed(() => c() + d()); // 8

    expect(e()).toBe(8);

    a.set(3);
    expect(e()).toBe(12);

    b.set(4);
    expect(e()).toBe(18);

    a.set(2);
    b.set(3);
    expect(e()).toBe(13);
  });
});
