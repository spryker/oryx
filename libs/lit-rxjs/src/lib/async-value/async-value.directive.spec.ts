import { PartInfo } from 'lit/directive';
import { of } from 'rxjs';
import { AsyncValueObservableStrategy } from './async-value-observable-strategy';
import { AsyncValuePromiseStrategy } from './async-value-promise-strategy';
import { AsyncValueDirective } from './async-value.directive';

// TODO: get rid of it when fix ECMAScript Modules issue
jest.mock('lit', () => ({
  noChange: null,
}));

jest.mock('./async-value-promise-strategy.ts');

jest.mock('lit/async-directive.js', () => ({
  AsyncDirective: class {},
}));

jest.mock('lit/directive.js', () => ({
  directive: (): jest.Mock => jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MockObservableStrategy: Record<string, jest.SpyInstance | null> = {
  createSubscription: null,
  dispose: null,
};

const MockPromiseStrategy: Record<string, jest.SpyInstance | null> = {
  createSubscription: null,
  dispose: null,
};

describe('Async', () => {
  let asyncValue: AsyncValueDirective;

  beforeEach(async () => {
    asyncValue = new AsyncValueDirective({} as PartInfo);

    MockObservableStrategy.createSubscription = jest.spyOn(
      AsyncValueObservableStrategy.prototype,
      'createSubscription'
    );
    MockObservableStrategy.dispose = jest.spyOn(
      AsyncValueObservableStrategy.prototype,
      'dispose'
    );
    MockPromiseStrategy.createSubscription = jest.spyOn(
      AsyncValuePromiseStrategy.prototype,
      'createSubscription'
    );
    MockPromiseStrategy.dispose = jest.spyOn(
      AsyncValuePromiseStrategy.prototype,
      'dispose'
    );

    asyncValue.setValue = jest.fn();
    asyncValue.isConnected = true;
  });

  describe('render method', () => {
    it('should assign `AsyncValueObservableStrategy` instance to the `strategy` value if object is observable', () => {
      const mockObservable = of('mockObservable');

      asyncValue.render(mockObservable);

      expect(MockObservableStrategy.createSubscription).toHaveBeenCalledWith(
        mockObservable,
        expect.anything()
      );

      expect(asyncValue.strategy).toBeInstanceOf(AsyncValueObservableStrategy);
      expect(asyncValue.object).toEqual(mockObservable);
    });

    it('should assign `AsyncValueObservableStrategy` instance to the `strategy` value if object is promise', () => {
      const mockPromise = new Promise((resolve) => {
        resolve('mockPromise');
      });

      asyncValue.render(mockPromise);

      expect(MockPromiseStrategy.createSubscription).toHaveBeenCalledWith(
        mockPromise,
        expect.anything()
      );

      expect(asyncValue.strategy).toBeInstanceOf(AsyncValuePromiseStrategy);
      expect(asyncValue.object).toEqual(mockPromise);
    });

    it('should dispose and create new subscription if internal object have already assigned and new object reference has been passed', () => {
      const mockObservable = of('mockObservable');
      const mockPromise = new Promise((resolve) => {
        resolve('mockPromise');
      });

      asyncValue.render(mockObservable);

      expect(MockObservableStrategy.createSubscription).toHaveBeenCalledWith(
        mockObservable,
        expect.anything()
      );

      asyncValue.render(mockPromise);

      expect(MockObservableStrategy.dispose).toHaveBeenCalled();
      expect(MockPromiseStrategy.createSubscription).toHaveBeenCalledWith(
        mockPromise,
        expect.anything()
      );
      expect(asyncValue.object).toEqual(mockPromise);
    });
  });

  describe('disconnected method', () => {
    it('should dispose from the current subscription and reset internal variables', () => {
      const mockObservable = of('mockObservable');

      asyncValue.render(mockObservable);

      expect(MockObservableStrategy.createSubscription).toHaveBeenCalledWith(
        mockObservable,
        expect.anything()
      );
      expect(asyncValue.strategy).toBeInstanceOf(AsyncValueObservableStrategy);
      expect(asyncValue.object).toEqual(mockObservable);

      asyncValue.disconnected();

      expect(MockObservableStrategy.dispose).toHaveBeenCalled();
      expect(asyncValue.setValue).toHaveBeenCalledWith(null);
      expect(asyncValue.strategy).toBe(null);
      expect(asyncValue.object).toBe(null);
    });
  });

  describe('reconnected method', () => {
    it('should create subscription for already assigned object', () => {
      const mockObservable = of('mockObservable');

      asyncValue.render(mockObservable);

      expect(MockObservableStrategy.createSubscription).toHaveBeenCalledWith(
        mockObservable,
        expect.anything()
      );
      expect(asyncValue.strategy).toBeInstanceOf(AsyncValueObservableStrategy);
      expect(asyncValue.object).toEqual(mockObservable);

      asyncValue.reconnected();

      expect(MockObservableStrategy.createSubscription).toHaveBeenCalledWith(
        mockObservable,
        expect.anything()
      );
      expect(asyncValue.strategy).toBeInstanceOf(AsyncValueObservableStrategy);
      expect(asyncValue.object).toEqual(mockObservable);
    });
  });
});
