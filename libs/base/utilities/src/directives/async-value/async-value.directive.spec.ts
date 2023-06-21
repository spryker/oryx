/* eslint-disable @typescript-eslint/no-explicit-any */
import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PartInfo } from 'lit/directive.js';
import { BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { SpyInstance } from 'vitest';
import { AsyncValueObservableStrategy } from './async-value-observable-strategy';
import { AsyncValuePromiseStrategy } from './async-value-promise-strategy';
import { AsyncValueStrategy } from './async-value.model';
import { asyncValue, AsyncValueDirective } from './index';

const mockObservableSubsription = new Subscription();

const observableStrategyProto =
  AsyncValueObservableStrategy.prototype as unknown as Record<
    keyof AsyncValueStrategy,
    any
  >;
const promiseStrategyProto =
  AsyncValuePromiseStrategy.prototype as unknown as Record<
    keyof AsyncValueStrategy,
    any
  >;

const MockObservableStrategy: Record<
  string,
  SpyInstance<unknown[], unknown> | null
> = {
  createSubscription: null,
  dispose: null,
};

const MockPromiseStrategy: Record<
  string,
  SpyInstance<unknown[], unknown> | null
> = {
  createSubscription: null,
  dispose: null,
};

const mockInitialValue = 'mockInitialValue';

@customElement('mock-component')
export class MockComponent extends LitElement {
  mock$?: Promise<string> | BehaviorSubject<string>;

  render(): TemplateResult {
    return html`<div>${asyncValue(this.mock$)}</div>`;
  }
}

@customElement('mock-component-with-callback')
export class MockComponentCallback extends LitElement {
  mock$ = new Subject();

  render(): TemplateResult {
    return html`<div>
      ${asyncValue(
        this.mock$,
        (value) => html`<div class="callback">${value}</div>`,
        () => html`<div class="fallback"></div>`
      )}
    </div>`;
  }
}

describe('asyncValue', () => {
  describe('class functionality', () => {
    let asyncValue: AsyncValueDirective;

    beforeEach(() => {
      asyncValue = new AsyncValueDirective({} as PartInfo);

      MockObservableStrategy.createSubscription = vi
        .spyOn(observableStrategyProto, 'createSubscription')
        .mockReturnValue(mockObservableSubsription);
      MockObservableStrategy.dispose = vi.spyOn(
        observableStrategyProto,
        'dispose'
      );
      MockPromiseStrategy.createSubscription = vi.spyOn(
        promiseStrategyProto,
        'createSubscription'
      );
      MockPromiseStrategy.dispose = vi.spyOn(promiseStrategyProto, 'dispose');

      asyncValue.setValue = vi.fn();
      asyncValue.isConnected = true;
    });

    afterEach(async () => {
      observableStrategyProto.createSubscription.mockReset();
      observableStrategyProto.dispose.mockReset();
      promiseStrategyProto.createSubscription.mockReset();
      promiseStrategyProto.dispose.mockReset();

      MockObservableStrategy.createSubscription?.mockRestore();
      MockObservableStrategy.dispose?.mockRestore();
      MockPromiseStrategy.createSubscription?.mockRestore();
      MockPromiseStrategy.dispose?.mockRestore();
    });

    describe('render method', () => {
      it('should assign `AsyncValueObservableStrategy` instance to the `strategy` value if object is observable', () => {
        const mockObservable = of('mockObservable');

        asyncValue.render(mockObservable);

        expect(MockObservableStrategy.createSubscription).toHaveBeenCalledWith(
          mockObservable,
          expect.anything()
        );

        expect(asyncValue.strategy).toBeInstanceOf(
          AsyncValueObservableStrategy
        );
        expect(asyncValue.object).toEqual(mockObservable);
      });

      it('should assign `AsyncValuePromiseStrategy` instance to the `strategy` value if object is promise', () => {
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

        expect(MockObservableStrategy.dispose).toHaveBeenCalledWith(
          mockObservableSubsription
        );
        expect(MockPromiseStrategy.createSubscription).toHaveBeenCalledWith(
          mockPromise,
          expect.anything()
        );
        expect(asyncValue.object).toEqual(mockPromise);
      });

      it('should throw error if value is not observable or promise', async () => {
        expect(() => asyncValue.render('notObservable' as any)).throw();
      });
    });

    describe('disconnected method', () => {
      it('should dispose from the current subscription and reset internal variables', async () => {
        const mockObservable = of('mockObservable');

        asyncValue.render(mockObservable);

        expect(MockObservableStrategy.createSubscription).toHaveBeenCalledWith(
          mockObservable,
          expect.anything()
        );
        expect(asyncValue.strategy).toBeInstanceOf(
          AsyncValueObservableStrategy
        );
        expect(asyncValue.object).toEqual(mockObservable);

        asyncValue.isConnected = false;
        await asyncValue.disconnected();

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
        expect(asyncValue.strategy).toBeInstanceOf(
          AsyncValueObservableStrategy
        );
        expect(asyncValue.object).toEqual(mockObservable);

        asyncValue.reconnected();

        expect(MockObservableStrategy.createSubscription).toHaveBeenCalledWith(
          mockObservable,
          expect.anything()
        );
        expect(asyncValue.strategy).toBeInstanceOf(
          AsyncValueObservableStrategy
        );
        expect(asyncValue.object).toEqual(mockObservable);
      });
    });
  });

  describe('directive', () => {
    describe('without callback', () => {
      let element: MockComponent;

      beforeEach(async () => {
        element = await fixture(html`<mock-component></mock-component>`);
      });

      it('should render emmited value of observable', async () => {
        element.mock$ = new BehaviorSubject(mockInitialValue);
        element.requestUpdate();
        await element.updateComplete;

        const mockUpdateValue = 'mockUpdateValue';
        expect(element.shadowRoot?.textContent).toEqual(mockInitialValue);

        element.mock$.next(mockUpdateValue);
        expect(element.shadowRoot?.textContent).toEqual(mockUpdateValue);
      });

      it('should render resolved value of promise', async () => {
        element.mock$ = Promise.resolve(mockInitialValue);
        element.requestUpdate();
        await element.updateComplete;

        expect(element.shadowRoot?.textContent).toEqual(mockInitialValue);
      });

      it('should throw error if value is not observable or promise', async () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          element.mock$ = 'notObservable' as any;
          element.requestUpdate();
          await element.updateComplete;
        } catch (error) {
          expect(error).toBeTypeOf('string');
        }
      });
    });

    describe('with callback', () => {
      let element: MockComponentCallback;

      beforeEach(async () => {
        element = await fixture(
          html`<mock-component-with-callback></mock-component-with-callback>`
        );
      });

      it('should render defined template if callback is defined', async () => {
        element.mock$.next(mockInitialValue);
        element.requestUpdate();
        await element.updateComplete;

        const callbackBlock = element.shadowRoot?.querySelector('.callback');

        expect(element).toContainElement('.callback');
        expect(element).not.toContainElement('.fallback');
        expect(callbackBlock?.textContent).toEqual(mockInitialValue);
      });

      it('should render defined fallback if emisson has not happened', async () => {
        element.requestUpdate();
        await element.updateComplete;
        expect(element).toContainElement('.fallback');
      });
    });
  });
});
