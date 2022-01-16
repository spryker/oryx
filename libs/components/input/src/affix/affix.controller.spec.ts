import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { AffixController } from './affix.controller';

export class TestComponent extends LitElement {
  protected affixController = new AffixController(this);
  @property() prefixIcon?: string;
  @property() suffixIcon?: string;

  render(): TemplateResult {
    return html` ${this.renderPrefix()}${this.renderSuffix()} `;
  }

  protected renderPrefix(): TemplateResult {
    return this.affixController.render('prefix', this.prefixIcon);
  }

  protected renderSuffix(): TemplateResult {
    return this.affixController.render('suffix', this.suffixIcon);
  }
}

customElements.define('test-control', TestComponent);

describe('ErrorController', () => {
  let element: TestComponent;

  describe('prefix', () => {
    describe('when a prefixIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<test-control prefixIcon="search"></test-control>`
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
        element = await fixture(html`<test-control> </test-control>`);
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
          html`<test-control suffixIcon="search"></test-control>`
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
        element = await fixture(html`<test-control> </test-control>`);
      });
      it('should not have .has-suffix-content class', () => {
        expect(element.classList.contains('has-suffix-content')).to.be.false;
      });
    });
  });
});
