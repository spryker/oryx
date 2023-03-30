import { createSignal, Signal } from './proxy-factories';

describe('createSignal', () => {
  let signal: Signal<number>;

  beforeEach(() => {
    signal = createSignal(1);
  });

  it('should return initial value', () => {
    expect(signal + 0).toEqual(1);
  });

  it('should coerce to value', () => {
    const c = signal + 0;
    expect(c).toEqual(1);
  });

  it('should coerce to string', () => {
    const c = signal + '';
    expect(c).toEqual('1');
  });
});
