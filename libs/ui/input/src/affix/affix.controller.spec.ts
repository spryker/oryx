import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { OryxElement } from '../../../utilities';
import { AffixController } from './affix.controller';
import { AffixOptions } from './affix.model';

export class AffixComponent
  extends LitElement
  implements OryxElement<AffixOptions>
{
  @property({ type: Object }) options: AffixOptions = {};
  protected affixController = new AffixController(this);

  render(): TemplateResult {
    return html`${this.affixController.renderPrefix()}${this.affixController.renderSuffix()}`;
  }
}
customElements.define('fake-affix', AffixComponent);

describe('AffixController', () => {
  let element: AffixComponent;

  describe('prefix', () => {
    describe('when a prefixIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-affix .options=${{ prefixIcon: 'search' }}></fake-affix>`
        );
      });
      it('should render the icon in the prefix slot', () => {
        expect(
          element.shadowRoot?.querySelector('slot[name=prefix] > oryx-icon')
        ).to.exist;
      });
    });

    describe('when no prefix content is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-affix></fake-affix>`);
      });
      it('should not have .has-prefix-content class', () => {
        expect(element.classList.contains('has-prefix-content')).to.be.false;
      });
    });
  });

  describe('suffix', () => {
    describe('when a suffixIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-affix .options=${{ suffixIcon: 'search' }}></fake-affix>`
        );
      });
      it('should render the icon in the suffix slot', () => {
        expect(
          element.shadowRoot?.querySelector('slot[name=suffix] > oryx-icon')
        ).to.exist;
      });
    });

    describe('when suffix content is not slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-affix></fake-affix>`);
      });
      it('should not have .has-suffix-content class', () => {
        expect(element.classList.contains('has-suffix-content')).to.be.false;
      });
    });
  });
});
