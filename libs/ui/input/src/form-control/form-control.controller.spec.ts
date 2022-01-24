import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { FormControlController } from './form-control.controller';

export class TestComponent extends LitElement {
  protected formControlController = new FormControlController(this);

  render(): TemplateResult {
    return this.formControlController.render();
  }

  get control(): HTMLInputElement | undefined {
    return this.formControlController.control;
  }
}

customElements.define('test-control', TestComponent);

export class NoSlotComponent extends LitElement {
  protected formControlController = new FormControlController(this);

  render(): TemplateResult {
    return html``;
  }

  get control(): HTMLInputElement | undefined {
    return this.formControlController.control;
  }
}
customElements.define('no-slot', NoSlotComponent);

describe('FormControlController', () => {
  describe('when no slot is available', () => {
    let element: NoSlotComponent;
    beforeEach(async () => {
      element = await fixture(html`<no-slot />`);
    });

    it('should not render a control', () => {
      expect(element.control).to.be.undefined;
    });
  });
});
