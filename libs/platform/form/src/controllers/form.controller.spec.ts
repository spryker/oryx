import { fixture, html } from '@open-wc/testing-helpers';
import { FormController } from '@spryker-oryx/form';
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

  afterEach(() => {
    mockFeatureVersion('1.0');
  });

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

    describe('featureVersion >= 1.4', () => {
      const callback = vi.fn();

      beforeEach(async () => {
        mockFeatureVersion('1.4');
        element = await fixture(html`<fake-form></fake-form>`);
        element.getForm()?.addEventListener('oryx.submit', callback);
        element.getForm()?.dispatchEvent(new Event('submit'));
      });

      it('should dispatch oryx.submit event by the form element', () => {
        expect(callback).toHaveBeenCalled();
      });
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
