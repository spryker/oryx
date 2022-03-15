import { of } from 'rxjs';
import { AsyncValueObservableStrategy } from './async-value-observable-strategy';

const mockCallback = vi.fn();

describe('AsyncValueObservableStrategy', () => {
  let asyncValueObservableStrategy: AsyncValueObservableStrategy;

  beforeEach(() => {
    asyncValueObservableStrategy = new AsyncValueObservableStrategy();

    mockCallback.mockReset();
  });

  describe('createSubscription method', () => {
    it('should call callback when observable has been emmited', async () => {
      const mockResult = 'mockResult';
      const mockPromise = of(mockResult);

      const strategy = asyncValueObservableStrategy.createSubscription<string>(
        mockPromise,
        mockCallback
      );

      asyncValueObservableStrategy.dispose(strategy);

      expect(mockCallback).toBeCalledWith(mockResult);
    });
  });
});
