import { expect } from '@open-wc/testing';
import { of } from 'rxjs';
import { spy } from 'sinon';
import { AsyncValueObservableStrategy } from './async-value-observable-strategy';

const mockCallback = spy();

describe('AsyncValueObservableStrategy', () => {
  let asyncValueObservableStrategy: AsyncValueObservableStrategy;

  beforeEach(() => {
    asyncValueObservableStrategy = new AsyncValueObservableStrategy();

    mockCallback.resetHistory();
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

      expect(mockCallback).calledWithExactly(mockResult);
    });
  });
});
