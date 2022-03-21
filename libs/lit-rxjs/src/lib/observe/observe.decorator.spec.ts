/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BehaviorSubject, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { observe } from './observe.decorator';

const mockProperty = 'mockProperty';
const mockAnotherProperty = 'mockAnotherProperty';
const destroy$ = new Subject<void>();

abstract class MockClass extends LitElement {
  abstract mock: string;
  anotherMock?: string;
  mock$?: Subject<string>;
}

@customElement('mock-component')
export class MockComponent extends MockClass {
  @property()
  mock = 'mock';

  @observe()
  mock$ = new ReplaySubject<string>(1);
}

@customElement('mock-component-with-property')
export class MockComponentWithProperty extends MockClass {
  @property()
  anotherMock = 'anotherMock';

  @property()
  mock = 'mock';

  @observe('anotherMock')
  mock$ = new BehaviorSubject(this.anotherMock);
}

describe('observe decorator', () => {
  let element: MockClass;

  const getElement = (selector = 'mock-component'): MockClass => {
    return document.body.querySelector(selector)!;
  };

  beforeEach(async () => {
    document.body.innerHTML = `<mock-component mock="${mockProperty}"></mock-component>`;
    await window.happyDOM.whenAsyncComplete();
    element = getElement();
  });

  afterEach(() => {
    destroy$.next();
  });

  describe('observable is BehaviorSubject', () => {
    beforeEach(() => {
      element.mock$ = new BehaviorSubject(mockProperty);
    });

    it('should use created subject instance and emit updated value if passed observed property has been changed', () => {
      const callback = vi.fn();
      element.mock$!.pipe(takeUntil(destroy$)).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockProperty);
      expect(element.mock$).toBeInstanceOf(BehaviorSubject);
      element.mock = mockAnotherProperty;
      expect(callback).toHaveBeenNthCalledWith(2, mockAnotherProperty);
    });
  });

  describe('observable is ReplaySubject', () => {
    it('should use created subject instance and emit updated value if passed observed property has been changed', () => {
      const callback = vi.fn();
      element.mock$!.pipe(takeUntil(destroy$)).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockProperty);
      expect(element.mock$).toBeInstanceOf(ReplaySubject);
      element.mock = mockAnotherProperty;
      expect(callback).toHaveBeenNthCalledWith(2, mockAnotherProperty);
    });
  });

  describe('observable is Subject', () => {
    beforeEach(() => {
      element.mock$ = new Subject();
    });

    it('should use created subject instance and emit updated value if passed observed property has been changed', () => {
      const callback = vi.fn();
      element.mock$!.pipe(takeUntil(destroy$)).subscribe(callback);

      expect(callback).not.toHaveBeenCalled();
      expect(element.mock$).toBeInstanceOf(Subject);
      element.mock = mockAnotherProperty;
      expect(callback).toHaveBeenNthCalledWith(1, mockAnotherProperty);
    });
  });

  describe('with property', () => {
    beforeEach(async () => {
      document.body.innerHTML = `<mock-component-with-property anotherMock="${mockProperty}"></mock-component-with-property>`;
      await window.happyDOM.whenAsyncComplete();
      element = getElement('mock-component-with-property');
    });

    it('should observe for the required property', () => {
      const callback = vi.fn();
      element.mock$?.pipe(takeUntil(destroy$)).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockProperty);
      element.anotherMock = mockAnotherProperty;
      expect(callback).toHaveBeenNthCalledWith(2, mockAnotherProperty);
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
        expect(error).toBeTypeOf('string');
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
