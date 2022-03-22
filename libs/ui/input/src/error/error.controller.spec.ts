import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { a11yConfig } from '../../../a11y';
import { ErrorMessageComponent } from '../../../error-message/index';
import { ErrorController } from './error.controller';
import { ErrorOptions } from './error.model';

@customElement('fake-el')
class ErrorComponent extends LitElement implements ErrorOptions {
  protected errorController = new ErrorController(this);

  @property() errorMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;

  render(): TemplateResult {
    return this.errorController.render();
  }
}

describe('ErrorController', () => {
  let element: ErrorComponent;
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

      it('should have an hasError attribute', () => {
        expect(element.hasAttribute('hasError')).to.true;
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

    it('should not have an hasError attribute', () => {
      expect(element.hasAttribute('hasError')).to.false;
    });
  });

  describe('when no error message is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-el .showError=${true}></fake-el>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should not have an hasError attribute', () => {
      expect(element.hasAttribute('hasError')).to.false;
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

    it('should have an hasError attribute', () => {
      expect(element.hasAttribute('hasError')).to.true;
    });
  });
});
