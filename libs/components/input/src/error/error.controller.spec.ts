import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ErrorMessageComponent } from '../../../error-message/src/error-message.component';
import { ErrorController } from './error.controller';

export class TestComponent extends LitElement {
  protected errorController = new ErrorController(this);
  @property() errorMessage?: string;

  render(): TemplateResult {
    return html` ${this.errorController.render(this.errorMessage)} `;
  }
}

customElements.define('test-control', TestComponent);

describe('ErrorController', () => {
  let element: TestComponent;
  describe('error', () => {
    describe('when an error message is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<test-control errorMessage="error message"></test-control>`
        );
      });

      it('should pass the message to the errorMessage component', () => {
        const errorMessage = element?.shadowRoot?.querySelector(
          'oryx-error-message'
        ) as ErrorMessageComponent;
        expect(errorMessage?.message).to.equal('error message');
      });

      it('should have a has-error class', () => {
        expect(element.classList.contains('has-error')).to.true;
      });
    });

    describe('when no error message is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<test-control></test-control>`);
      });

      it('should not have an errorMessage element', () => {
        const errorMessage = element.shadowRoot?.querySelector(
          'oryx-error-message'
        ) as ErrorMessageComponent;
        expect(errorMessage).not.to.exist;
      });

      it('should not have a has-error class', () => {
        expect(element.classList.contains('has-error')).to.be.false;
      });
    });

    describe('when no error message is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<test-control .showError=${true}></test-control>`
        );
      });

      it('should not have an errorMessage element', () => {
        const errorMessage = element?.shadowRoot?.querySelector(
          'oryx-error-message'
        ) as ErrorMessageComponent;
        expect(errorMessage).to.not.exist;
      });

      it('should not have a has-error class', () => {
        expect(element.classList.contains('has-error')).to.be.false;
      });
    });

    describe('when error content is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<test-control>
          <div slot="error">error</div>
        </test-control>`);
      });

      it('should have an has-error class', () => {
        expect(element.classList.contains('has-error')).to.true;
      });
    });
  });
});
