import { throttle } from './throttle';

describe('Throttle', () => {
  const timer = 50;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not trigger a function next time before timer ends', async () => {
    const mockFn = vi.fn();
    const fn = throttle(mockFn, timer);

    fn();
    vi.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(timer - 10);

    fn();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should trigger a function next time after timer ends', async () => {
    const mockFn = vi.fn();
    const fn = throttle(mockFn, timer);

    fn();
    vi.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(timer + 10);

    fn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  describe('when third param is not provided', () => {
    it('should not trigger a function after timer ends', async () => {
      const mockFn = vi.fn();
      const fn = throttle(mockFn, timer);

      fn();
      vi.runAllTimers();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(timer);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('when third param is provided', () => {
    it('should trigger a function after timer ends', async () => {
      const mockFn = vi.fn();
      const fn = throttle(mockFn, timer, true);

      fn();
      vi.advanceTimersByTime(timer - 1);

      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1);

      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});
