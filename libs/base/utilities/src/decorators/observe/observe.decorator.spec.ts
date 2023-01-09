/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { observe } from './observe.decorator';

const mockPropertyA = 'mockPropertyA';
const mockPropertyB = 'mockPropertyB';

abstract class MockClass extends LitElement {
  abstract mock: string;
  anotherMock?: string;
  mock$?: Subject<string>;
  mockArr$?: Subject<string[]>;
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

@customElement('mock-component-props-array')
export class MockComponentPropsArray extends MockClass {
  @property()
  anotherMock = 'anotherMock';

  @property()
  mock = 'mock';

  @observe(['mock', 'anotherMock'])
  mockArr$ = new BehaviorSubject([this.mock, this.anotherMock]);
}

describe('observe decorator', () => {
  let element: MockClass;

  beforeEach(async () => {
    element = await fixture(
      html`<mock-component mock="${mockPropertyA}"></mock-component>`
    );
  });

  it('should use ReplaySubject instance and emit updated value if passed observed property has been changed', () => {
    const callback = vi.fn();
    element.mock$!.subscribe(callback);
    expect(callback).toHaveBeenCalledWith(mockPropertyA);
    expect(element.mock$).toBeInstanceOf(ReplaySubject);
    element.mock = mockPropertyB;
    expect(callback).toHaveBeenNthCalledWith(2, mockPropertyB);
  });

  it('should use BehaviorSubject instance and emit updated value if passed observed property has been changed', () => {
    element.mock$ = new BehaviorSubject(mockPropertyA);
    const callback = vi.fn();
    element.mock$!.subscribe(callback);
    expect(callback).toHaveBeenCalledWith(mockPropertyA);
    expect(element.mock$).toBeInstanceOf(BehaviorSubject);
    element.mock = mockPropertyB;
    expect(callback).toHaveBeenNthCalledWith(2, mockPropertyB);
  });

  it('should use Subject instance and emit updated value if passed observed property has been changed', () => {
    element.mock$ = new Subject();
    const callback = vi.fn();
    element.mock$!.subscribe(callback);
    expect(callback).not.toHaveBeenCalled();
    expect(element.mock$).toBeInstanceOf(Subject);
    element.mock = mockPropertyB;
    expect(callback).toHaveBeenNthCalledWith(1, mockPropertyB);
  });

  describe('when observable is array of properties', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<mock-component-with-property
          anotherMock="${mockPropertyA}"
        ></mock-component-with-property>`
      );
    });

    it('should observe for the required property', () => {
      const callback = vi.fn();
      element.mock$?.subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockPropertyA);
      element.anotherMock = mockPropertyB;
      expect(callback).toHaveBeenNthCalledWith(2, mockPropertyB);
    });
  });

  describe('when component with passed property', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<mock-component-props-array
          mock="${mockPropertyA}"
          anotherMock="${mockPropertyB}"
        ></mock-component-props-array>`
      );
    });

    it('should emit array of observed properties', () => {
      const callback = vi.fn();
      element.mockArr$?.subscribe(callback);
      expect(callback).toHaveBeenCalledWith([mockPropertyA, mockPropertyB]);
      element.anotherMock = mockPropertyA;
      expect(callback).toHaveBeenNthCalledWith(2, [
        mockPropertyA,
        mockPropertyA,
      ]);
      element.mock = mockPropertyB;
      expect(callback).toHaveBeenNthCalledWith(3, [
        mockPropertyB,
        mockPropertyA,
      ]);
    });
  });

  describe('when errors has been thrown', () => {
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
