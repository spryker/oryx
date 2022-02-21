import { expect } from '@open-wc/testing';
import { spy } from 'sinon';
import { AsyncValuePromiseStrategy } from './async-value-promise-strategy';

const mockCallback = spy();

describe('AsyncValuePromiseStrategy', () => {
  let asyncValuePromiseStrategy: AsyncValuePromiseStrategy;

  beforeEach(() => {
    asyncValuePromiseStrategy = new AsyncValuePromiseStrategy();

    mockCallback.resetHistory();
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

      expect(mockCallback).calledWith(mockResult);
    });
  });
});
