import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { OryxElement } from '../../../utilities';
import { FormControlController } from './form-control.controller';
import { FormControlOptions } from './form-control.model';

export class NoSlotComponent
  extends LitElement
  implements OryxElement<FormControlOptions>
{
  @property({ type: Object }) options: FormControlOptions = {};
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
