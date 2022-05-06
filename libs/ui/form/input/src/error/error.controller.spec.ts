import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing/a11y';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { a11yConfig } from '../../../../a11y';
import { ErrorMessageComponent } from '../../../../error-message/index';
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
  let errorMessage: ErrorMessageComponent;
  describe('error', () => {
    describe('when an error message is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-el errorMessage="error message"></fake-el>`
        );

        errorMessage = element?.renderRoot.querySelector(
          'oryx-error-message'
        ) as ErrorMessageComponent;
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should pass the message to the errorMessage component', () => {
        expect(errorMessage?.message).toEqual('error message');
      });

      it('should have an hasError host attribute', () => {
        expect(element.hasAttribute('hasError')).toBe(true);
      });

      describe('and error message then removed', () => {
        beforeEach(async () => {
          element.removeAttribute('errorMessage');
          await elementUpdated(element);
        });

        it('should not pass the message to the errorMessage component', () => {
          expect(errorMessage?.message).toBeNull();
        });

        it('should remove an hasError host attribute', () => {
          expect(element.hasAttribute('hasError')).toBe(false);
        });
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
      expect(element.hasAttribute('hasError')).toBe(false);
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
      expect(element.hasAttribute('hasError')).toBe(false);
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

    it('should have an hasError host attribute', () => {
      expect(element.hasAttribute('hasError')).toBe(true);
    });

    describe('and error content then removed', () => {
      beforeEach(async () => {
        element.querySelector('[slot=error]')?.remove();
        await elementUpdated(element);
      });

      it('should remove an hasError host attribute', () => {
        expect(element.hasAttribute('hasError')).toBe(false);
      });
    });
  });

  describe('when there is no error message/content and error state is preset', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-el hasError></fake-el>`);
      errorMessage = element?.renderRoot.querySelector(
        'oryx-error-message'
      ) as ErrorMessageComponent;
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should keep an hasError host attribute', () => {
      expect(element.hasAttribute('hasError')).toBe(true);
    });

    it('should not render errorMessage component content', () => {
      expect(errorMessage?.hasAttribute('hasErrorContent')).toBe(false);
    });
  });
});
