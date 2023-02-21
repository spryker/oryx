import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CheckedController } from './checked.controller';

@customElement('fake-input')
class FakeInput extends LitElement {
  controller = new CheckedController(this);

  protected render(): TemplateResult {
    return html` <slot @slotchange=${this.controller.onSlotChange}></slot> `;
  }
}

describe('CheckedController', () => {
  let element: FakeInput;

  const getInput = (): HTMLInputElement =>
    element.querySelector('input') as HTMLInputElement;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when no input is slotted in', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-input><span></span></fake-input>`);
    });

    it('should throw an error', () => {
      expect(element.controller.onSlotChange).toThrow(
        'Form control was not found'
      );
    });
  });

  describe('when input is slotted', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(
        html`<fake-input>
          <input checked type="checkbox" @change=${callback} />
        </fake-input>`
      );
    });

    describe('and input changes its attribute', () => {
      beforeEach(async () => {
        getInput().removeAttribute('checked');

        element.requestUpdate();
        await elementUpdated(element);
      });

      it('should dispatch "change" event', () => {
        expect(callback).toHaveBeenCalled();
      });

      it('should align the property with attribute`s value', () => {
        expect(getInput().checked).toBe(getInput().hasAttribute('checked'));
      });
    });

    describe('and host is disconnected', () => {
      beforeEach(async () => {
        element.controller.hostDisconnected();
        element.controller.onSlotChange();
      });

      it('should not dispatch the change event', () => {
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });
});
