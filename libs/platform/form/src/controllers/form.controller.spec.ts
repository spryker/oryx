import { fixture, html } from '@open-wc/testing-helpers';
import { FormController } from 'libs/platform/form/src';
import { LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FormMixinProperties } from '../models';

@customElement('fake-form')
class FakeFormComponent extends LitElement implements FormMixinProperties {
  controller = new FormController(this);

  submit(): void {
    return;
  }
  values = {};

  getForm(): HTMLFormElement | null {
    return this.renderRoot.querySelector('form');
  }

  render(): TemplateResult {
    return html`<form>
      <input name="test" value="test" required />
    </form>`;
  }
}

describe('FormController', () => {
  let element: FakeFormComponent;

  describe('when form is submitted', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(
        html`<fake-form @oryx.submit=${callback}></fake-form>`
      );
      element.getForm()?.dispatchEvent(new Event('submit'));
    });

    it('should collect form values and dispatch event', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            values: expect.objectContaining({ test: 'test' }),
          }),
        })
      );
    });
  });

  describe('when controller is disconnected', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(
        html`<fake-form @oryx.submit=${callback}></fake-form>`
      );
      element.controller.hostDisconnected();
      element.getForm()?.dispatchEvent(new Event('submit'));
    });

    it('should not dispatch the event', () => {
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
