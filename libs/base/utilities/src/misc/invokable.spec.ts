import { BehaviorSubject, of } from 'rxjs';
import { invokable } from './invokable';

describe('Invokable', () => {
  const mockValue = 'mockValue';
  const callback = vi.fn().mockReturnValue(of(mockValue));
  const mockObs = new BehaviorSubject(false);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should invoke provided as argument observable', () => {
    invokable(mockObs.pipe(callback)).subscribe();

    expect(callback).toHaveBeenCalled();
  });

  it('should invoke provided as argument observable even if not subscribed on returned observable', () => {
    invokable(mockObs.pipe(callback));

    expect(callback).toHaveBeenCalled();
  });

  it('should return value of invoked observable', () => {
    invokable(mockObs.pipe(callback)).subscribe((data) => {
      expect(data).toBe(mockValue);
    });
  });
});
