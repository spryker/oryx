import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PartInfo } from 'lit/directive';
import { BehaviorSubject, of } from 'rxjs';
import { SinonStub, spy, stub } from 'sinon';
import { asyncValue } from '.';
import { AsyncValueObservableStrategy } from './async-value-observable-strategy';
import { AsyncValuePromiseStrategy } from './async-value-promise-strategy';
import { AsyncValueDirective } from './async-value.directive';
import { AsyncValueStrategy } from './types';

const mockObservableSubsription = 'mockObservableSubsription';

const observableStrategyProto =
  AsyncValueObservableStrategy.prototype as unknown as Record<
    keyof AsyncValueStrategy,
    SinonStub
  >;
const promiseStrategyProto =
  AsyncValuePromiseStrategy.prototype as unknown as Record<
    keyof AsyncValueStrategy,
    SinonStub
  >;

const MockObservableStrategy: Record<string, SinonStub | null> = {
  createSubscription: null,
  dispose: null,
};

const MockPromiseStrategy: Record<string, SinonStub | null> = {
  createSubscription: null,
  dispose: null,
};

const mockInitialValue = 'mockInitialValue';

@customElement('mock-component')
export class MockComponent extends LitElement {
  mock$?: Promise<string> | BehaviorSubject<string>;

  render(): TemplateResult {
    return html`${asyncValue(this.mock$)}`;
  }
}

describe('asyncValue', () => {
  describe('class functionality', () => {
    let asyncValue: AsyncValueDirective;

    beforeEach(() => {
      asyncValue = new AsyncValueDirective({} as PartInfo);

      MockObservableStrategy.createSubscription = stub(
        observableStrategyProto,
        'createSubscription'
      ).returns(mockObservableSubsription);
      MockObservableStrategy.dispose = stub(observableStrategyProto, 'dispose');
      MockPromiseStrategy.createSubscription = stub(
        promiseStrategyProto,
        'createSubscription'
      );
      MockPromiseStrategy.dispose = stub(promiseStrategyProto, 'dispose');

      asyncValue.setValue = spy();
      asyncValue.isConnected = true;
    });

    afterEach(async () => {
      observableStrategyProto.createSubscription.restore();
      observableStrategyProto.dispose.restore();
      promiseStrategyProto.createSubscription.restore();
      promiseStrategyProto.dispose.restore();
    });

    describe('render method', () => {
      it('should assign `AsyncValueObservableStrategy` instance to the `strategy` value if object is observable', () => {
        const mockObservable = of('mockObservable');

        asyncValue.render(mockObservable);

        expect(MockObservableStrategy.createSubscription).calledWith(
          mockObservable
        );

        expect(asyncValue.strategy).instanceof(AsyncValueObservableStrategy);
        expect(asyncValue.object).equal(mockObservable);
      });

      it('should assign `AsyncValuePromiseStrategy` instance to the `strategy` value if object is promise', () => {
        const mockPromise = new Promise((resolve) => {
          resolve('mockPromise');
        });

        asyncValue.render(mockPromise);

        expect(MockPromiseStrategy.createSubscription).calledWith(mockPromise);

        expect(asyncValue.strategy).instanceof(AsyncValuePromiseStrategy);
        expect(asyncValue.object).equal(mockPromise);
      });

      it('should dispose and create new subscription if internal object have already assigned and new object reference has been passed', () => {
        const mockObservable = of('mockObservable');
        const mockPromise = new Promise((resolve) => {
          resolve('mockPromise');
        });

        asyncValue.render(mockObservable);

        expect(MockObservableStrategy.createSubscription).calledWith(
          mockObservable
        );

        asyncValue.render(mockPromise);

        expect(MockObservableStrategy.dispose).calledWithExactly(
          mockObservableSubsription
        );
        expect(MockPromiseStrategy.createSubscription).calledWith(mockPromise);
        expect(asyncValue.object).equal(mockPromise);
      });

      it('should throw error if value is not observable or promise', async () => {
        expect(() => asyncValue.render('notObservable' as any)).throw();
      });
    });

    describe('disconnected method', () => {
      it('should dispose from the current subscription and reset internal variables', () => {
        const mockObservable = of('mockObservable');

        asyncValue.render(mockObservable);

        expect(MockObservableStrategy.createSubscription).calledWith(
          mockObservable
        );
        expect(asyncValue.strategy).instanceof(AsyncValueObservableStrategy);
        expect(asyncValue.object).equal(mockObservable);

        asyncValue.disconnected();

        expect(MockObservableStrategy.dispose).calledWith();
        expect(asyncValue.setValue).calledWithExactly(null);
        expect(asyncValue.strategy).be.a('null');
        expect(asyncValue.object).be.a('null');
      });
    });

    describe('reconnected method', () => {
      it('should create subscription for already assigned object', () => {
        const mockObservable = of('mockObservable');

        asyncValue.render(mockObservable);

        expect(MockObservableStrategy.createSubscription).calledWith(
          mockObservable
        );
        expect(asyncValue.strategy).instanceof(AsyncValueObservableStrategy);
        expect(asyncValue.object).equal(mockObservable);

        asyncValue.reconnected();

        expect(MockObservableStrategy.createSubscription).calledWith(
          mockObservable
        );
        expect(asyncValue.strategy).instanceof(AsyncValueObservableStrategy);
        expect(asyncValue.object).equal(mockObservable);
      });
    });
  });

  describe('directive', () => {
    let element: MockComponent;

    beforeEach(async () => {
      element = await fixture(html`<mock-component></mock-component>`);
    });

    it('should render emmited value of observable', async () => {
      element.mock$ = new BehaviorSubject(mockInitialValue);
      element.requestUpdate();
      await element.updateComplete;

      const mockUpdateValue = 'mockUpdateValue';
      expect(element.shadowRoot?.textContent).equal(mockInitialValue);
      element.mock$.next(mockUpdateValue);
      expect(element.shadowRoot?.textContent).equal(mockUpdateValue);
    });

    it('should render resolved value of promise', async () => {
      element.mock$ = Promise.resolve(mockInitialValue);
      element.requestUpdate();
      await element.updateComplete;

      expect(element.shadowRoot?.textContent).equal(mockInitialValue);
    });

    it('should throw error if value is not observable or promise', async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        element.mock$ = 'notObservable' as any;
        element.requestUpdate();
        await element.updateComplete;
      } catch (error) {
        expect(error).be.an('string');
      }
    });
  });
});
