import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { FormControlMixin } from '../form-control';
import { LabelMixin } from './label.mixin';
export class LabelMixinComponent extends LabelMixin(LitElement) {
  render(): TemplateResult {
    return this.renderLabel();
  }
}

customElements.define('fake-label', LabelMixinComponent);

describe('LabelMixin', () => {
  let element: LabelMixinComponent;

  describe('label', () => {
    describe('when a label is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-label label="label content"></fake-label>`
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
    class FakeLabelWithRequiredControl extends LabelMixin(
      FormControlMixin(LitElement)
    ) {
      protected override render(): TemplateResult {
        return html`
          ${this.renderLabel()} ${this.formControlController.render()}
        `;
      }
    }
    customElements.define('fake-required', FakeLabelWithRequiredControl);

    describe('with control', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-required label="test">
          <input required />
        </fake-required>`);
      });

      describe('when a required input is slotted in', () => {
        it('should show a <sup>*</sup>', () => {
          expect(element.renderRoot.querySelector('sup')).to.exist;
        });
      });

      describe('when the required attribute is changing dynamically', () => {
        beforeEach(async () => {
          element.querySelector('input')?.toggleAttribute('required');
        });
        it('should no longer show a <sup>*</sup>', () => {
          expect(element.renderRoot.querySelector('sup')).to.not.exist;
        });
      });

      describe('when the required attribute is changing dynamically', () => {
        beforeEach(async () => {
          element.querySelector('input')?.setAttribute('required', 'true');
        });
        it('should no longer show a <sup>*</sup>', () => {
          expect(element.renderRoot.querySelector('sup')).to.exist;
        });
      });
    });

    describe('without control', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-required label="test">
          <span>no control</span>
        </fake-required>`);
      });

      describe('when there is no control slotted in', () => {
        it('should not show a <sup>*</sup>', () => {
          expect(element.renderRoot.querySelector('sup')).to.not.exist;
        });
      });
    });
  });
});
