import {computed, createSignal} from "@spryker-oryx/utilities";

describe('createSignal', () => {
  test('should create a signal with initial value', () => {
    const signal = createSignal(5);
    expect(signal()).toBe(5);
  });

  test('should set and get the value of the signal', () => {
    const signal = createSignal(0);
    signal.set(10);
    expect(signal()).toBe(10);
  });

  test('should subscribe and unsubscribe to signal changes', () => {
    const signal = createSignal(0);
    const callback = vi.fn();

    const unsubscribe = signal.subscribe(callback);
    signal.set(1);
    expect(callback).toHaveBeenCalledWith(1);

    unsubscribe();
    signal.set(2);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('computed', () => {
  test('should create a computed value based on signals', () => {
    const a = createSignal(1);
    const b = createSignal(2);
    const c = computed(() => a() + b());

    expect(c()).toBe(3);
  });

  test('should update computed value when dependencies change', () => {
    const a = createSignal(1);
    const b = createSignal(2);
    const c = computed(() => a() + b());
    expect(c()).toBe(3);
    a.set(3);
    expect(c()).toBe(5);
  });

  // test('should subscribe and unsubscribe to computed value changes', () => {
  //   const a = createSignal(1);
  //   const b = createSignal(2);
  //   const c = computed(() => a() + b());
  //   const callback = vi.fn();
  //
  //   const unsubscribe = c.subscribe(callback);
  //   a.set(3);
  //   expect(callback).toHaveBeenCalledWith(5);
  //
  //   unsubscribe();
  //   b.set(4);
  //   expect(callback).toHaveBeenCalledTimes(1);
  // });
});

// describe('installSignalSniffer', () => {
//   test('should install and uninstall a SignalSniffer', () => {
//     const signalSniffer: SignalSniffer = {
//       installed: vi.fn(),
//       uninstalled: vi.fn(),
//       reveal: vi.fn(),
//     };
//
//     const uninstall = installSignalSniffer(signalSniffer);
//     expect(signalSniffer.installed).toHaveBeenCalledTimes(1);
//
//     uninstall();
//     expect(signalSniffer.uninstalled).toHaveBeenCalledTimes(1);
//   });
// });
//
