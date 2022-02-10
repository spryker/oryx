import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { OryxElement } from '../../../utilities';
import { LabelController } from './label.controller';
import { LabelOptions } from './label.model';
export class LabelComponent
  extends LitElement
  implements OryxElement<LabelOptions>
{
  @property({ type: Object }) options: LabelOptions = {};
  protected labelController = new LabelController(this);

  render(): TemplateResult {
    return html`${this.labelController.render()}<slot><input /></slot>`;
  }
}
customElements.define('fake-label', LabelComponent);

describe('LabelController', () => {
  let element: LabelComponent;

  describe('label', () => {
    describe('when a label is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-label .options=${{ label: 'label content' }}></fake-label>`
        );
      });

      it('should render a label element', () => {
        const label = element.shadowRoot?.querySelector('label');
        expect(label?.innerText).to.equal('label content');
      });
    });

    describe('when a label is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-label></fake-label>`);
      });
      it('should not render a label element', () => {
        const label = element.shadowRoot?.querySelector('label');
        expect(label).not.to.exist;
      });
    });
  });

  describe('required notation', () => {
    describe('when the input is required', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-label .options=${{ label: 'test' }}>
          <input required />
        </fake-label>`);
      });
      it('should show a <sup>*</sup>', () => {
        expect(element.renderRoot.querySelector('sup')).to.exist;
      });
    });

    describe('when the input is not required', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-label .options=${{ label: 'test' }}>
          <input />
        </fake-label>`);
      });
      it('should show a <sup>*</sup>', () => {
        expect(element.renderRoot.querySelector('sup')).to.not.exist;
      });
    });
  });
});
