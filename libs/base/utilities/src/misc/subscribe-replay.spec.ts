import { BehaviorSubject, of } from 'rxjs';
import { subscribeReplay } from './subscribe-replay';

describe('subscribeReplay', () => {
  const mockValue = 'mockValue';
  const callback = vi.fn().mockReturnValue(of(mockValue));
  const mockObs = new BehaviorSubject(false);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should invoke provided as argument observable', () => {
    subscribeReplay(mockObs.pipe(callback)).subscribe();

    expect(callback).toHaveBeenCalled();
  });

  it('should invoke provided as argument observable even if not subscribed on returned observable', () => {
    subscribeReplay(mockObs.pipe(callback));

    expect(callback).toHaveBeenCalled();
  });

  it('should return value of invoked observable', () => {
    subscribeReplay(mockObs.pipe(callback)).subscribe((data) => {
      expect(data).toBe(mockValue);
    });
  });
});
