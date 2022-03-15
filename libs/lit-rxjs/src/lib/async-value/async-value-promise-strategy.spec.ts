import { AsyncValuePromiseStrategy } from './async-value-promise-strategy';

const mockCallback = vi.fn();

describe('AsyncValuePromiseStrategy', () => {
  let asyncValuePromiseStrategy: AsyncValuePromiseStrategy;

  beforeEach(() => {
    asyncValuePromiseStrategy = new AsyncValuePromiseStrategy();

    mockCallback.mockReset();
  });

  describe('createSubscription method', () => {
    it('should call callback when promise has been resolved', async () => {
      const mockResult = 'mockResult';
      const mockPromise = Promise.resolve(mockResult);

      asyncValuePromiseStrategy.createSubscription<string>(
        mockPromise,
        mockCallback
      );

      await mockPromise;

      expect(mockCallback).toHaveBeenCalledWith(mockResult);
    });
  });
});
