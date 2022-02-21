/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect, fixture, html } from '@open-wc/testing';
import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BehaviorSubject, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { spy } from 'sinon';
import { observe } from './observe.decorator';

const mockProperty = 'mockProperty';
const mockAnotherProperty = 'mockAnotherProperty';
const destroy$ = new Subject<void>();

abstract class MockClass extends LitElement {
  abstract mock: string;
  anotherMock?: string;
  mock$?: Subject<string> | null;
}

@customElement('mock-component')
export class MockComponent extends MockClass {
  @property()
  mock = 'mock';

  @observe()
  mock$?: Subject<string>;
}

@customElement('mock-component-with-property')
export class MockComponentWithProperty extends MockClass {
  @property()
  anotherMock = 'anotherMock';

  @property()
  mock = 'mock';

  @observe('anotherMock')
  mock$?: Subject<string>;
}

describe('observe decorator', () => {
  let element: MockClass;

  beforeEach(async () => {
    element = await fixture(
      html`<mock-component mock="${mockProperty}"></mock-component>`
    );
  });

  afterEach(() => {
    destroy$.next();
  });

  describe('observable is not defined', () => {
    it('should create `BehaviorSubject` under the hood and emit updated value if passed observed property has been changed', () => {
      const callback = spy();
      element.mock$!.pipe(takeUntil(destroy$)).subscribe(callback);
      expect(callback).calledWithExactly(mockProperty);
      expect(element.mock$).instanceof(BehaviorSubject);
      element.mock = mockAnotherProperty;
      expect(callback.secondCall).calledWithExactly(mockAnotherProperty);
    });
  });

  describe('observable is BehaviorSubject', () => {
    beforeEach(() => {
      element.mock$ = new BehaviorSubject('');
    });

    it('should use created subject instance and emit updated value if passed observed property has been changed', () => {
      const callback = spy();
      element.mock$!.pipe(takeUntil(destroy$)).subscribe(callback);
      expect(callback).calledWithExactly(mockProperty);
      expect(element.mock$).instanceof(BehaviorSubject);
      element.mock = mockAnotherProperty;
      expect(callback.secondCall).calledWithExactly(mockAnotherProperty);
    });
  });

  describe('observable is ReplaySubject', () => {
    beforeEach(() => {
      element.mock$ = new ReplaySubject(1);
    });

    it('should use created subject instance and emit updated value if passed observed property has been changed', () => {
      const callback = spy();
      element.mock$!.pipe(takeUntil(destroy$)).subscribe(callback);
      expect(callback).calledWithExactly(mockProperty);
      expect(element.mock$).instanceof(ReplaySubject);
      element.mock = mockAnotherProperty;
      expect(callback.secondCall).calledWithExactly(mockAnotherProperty);
    });
  });

  describe('observable is Subject', () => {
    beforeEach(() => {
      element.mock$ = new Subject();
    });

    it('should use created subject instance and emit updated value if passed observed property has been changed', () => {
      const callback = spy();
      element.mock$!.pipe(takeUntil(destroy$)).subscribe(callback);

      expect(callback).not.calledWith();
      expect(element.mock$).instanceof(Subject);
      element.mock = mockAnotherProperty;
      expect(callback.firstCall).calledWithExactly(mockAnotherProperty);
    });
  });

  describe('with property', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<mock-component-with-property
          anotherMock="${mockProperty}"
        ></mock-component-with-property>`
      );
    });

    it('should observe for the required property', () => {
      const callback = spy();
      element.mock$?.pipe(takeUntil(destroy$)).subscribe(callback);
      expect(callback).calledWithExactly(mockProperty);
      element.anotherMock = mockAnotherProperty;
      expect(callback.secondCall).calledWithExactly(mockAnotherProperty);
    });
  });

  describe('errors', () => {
    it('should throw if value is not observable instance or undefined', async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        element.mock$ = 'notObservable' as any;
        element.requestUpdate();
        await element.updateComplete;
      } catch (error) {
        expect(error).be.an('string');
      }
    });

    it('should throw if observed property refers to the undeclared property', () => {
      expect(() => {
        class MockErrorObservableProp extends MockClass {
          @property()
          mock = 'mock';

          @observe('incorrectMock')
          mock$?: Subject<string>;
        }

        return new MockErrorObservableProp();
      }).throw();

      expect(() => {
        class MockErrorObservableProp extends MockClass {
          @property()
          mock = 'mock';

          @observe()
          incorrectMock$?: Subject<string>;
        }

        return new MockErrorObservableProp();
      }).throw();
    });
  });
});
