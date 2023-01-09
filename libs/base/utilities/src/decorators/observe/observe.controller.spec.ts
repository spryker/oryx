import { fixture } from '@open-wc/testing-helpers';
import {
  html,
  LitElement,
  ReactiveController,
  ReactiveControllerHost,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Observable } from 'rxjs';
import { ObserveController } from './observe.controller';

const mockAValue = 'mockAValue';
const mockBValue = 'mockBValue';

vi.mock('rxjs', async () => {
  const rxjs = (await vi.importActual('rxjs')) as Array<unknown>;

  return {
    ...rxjs,
    defer: (fn: () => unknown): unknown => fn(),
  };
});

@customElement('mock-component')
class MockComponent extends LitElement {
  @property()
  mockA = mockAValue;

  @property()
  mockB = mockBValue;

  controller = new MockController(this);
}

class MockController<K extends ReactiveControllerHost>
  implements ReactiveController
{
  observeController = new ObserveController(this.host);

  constructor(public host: K) {
    (this.host = host).addController(this);
  }

  hostConnected(): void {
    ///
  }
}

describe('ObserveController', () => {
  let element: MockComponent;

  beforeEach(async () => {
    element = await fixture(html`<mock-component></mock-component>`);
  });

  describe('get', () => {
    it('should return Observable', () => {
      const { observeController } = element.controller;
      const subject$ = observeController.get('mockA');
      expect(subject$).toBeInstanceOf(Observable);
    });

    it('should emit property value', () => {
      const { observeController } = element.controller;
      const callback = vi.fn();
      const subjectA$ = observeController.get('mockA');
      subjectA$.subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockAValue);
    });

    it('should reemit if property value has been changed', async () => {
      const { observeController } = element.controller;
      const callback = vi.fn();
      const subjectA$ = observeController.get('mockA');
      subjectA$.subscribe(callback);
      expect(callback).toHaveBeenNthCalledWith(1, mockAValue);
      element.mockA = 'updateMockA';
      element.requestUpdate();
      await element.updateComplete;
      expect(callback).toHaveBeenNthCalledWith(2, 'updateMockA');
    });
  });
});
