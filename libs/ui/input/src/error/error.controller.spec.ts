import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { a11yConfig } from '../../../a11y';
import { ErrorMessageComponent } from '../../../error-message/index';
import { ErrorController } from './error.controller';
import { ErrorOptions } from './error.model';

@customElement('fake-el')
class ErrorMixinComponent extends LitElement implements ErrorOptions {
  protected errorController = new ErrorController(this);

  @property() errorMessage?: string;

  render(): TemplateResult {
    return this.errorController.render();
  }
}

describe('ErrorMixin', () => {
  let element: ErrorMixinComponent;
  describe('error', () => {
    describe('when an error message is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-el errorMessage="error message"></fake-el>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should pass the message to the errorMessage component', () => {
        const errorMessage = element?.renderRoot.querySelector(
          'oryx-error-message'
        ) as ErrorMessageComponent;
        expect(errorMessage?.message).to.equal('error message');
      });

      it('should have a has-error class', () => {
        expect(element.classList.contains('has-error')).to.true;
      });
    });
  });

  describe('when no error message is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-el></fake-el>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
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
      element = await fixture(html`<fake-el .showError=${true}></fake-el>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
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
      element = await fixture(html`<fake-el>
        <div slot="error">error</div>
      </fake-el>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should have an has-error class', () => {
      expect(element.classList.contains('has-error')).to.be.true;
    });
  });
});
