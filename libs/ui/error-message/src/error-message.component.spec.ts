import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
import { a11yConfig } from '@spryker-oryx/typescript-utils';
import { ErrorMessageComponent } from './error-message.component';
import './index';

describe('ErrorMessageComponent', () => {
  let element: ErrorMessageComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-error-message');
    expect(el).toBeInstanceOf(ErrorMessageComponent);
  });

  describe('when a message is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-error-message message="error validation message">
        </oryx-error-message>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should render an error icon', () => {
      expect(
        element?.shadowRoot?.querySelector('oryx-icon[type=warning]')
      ).not.toBeNull();
    });

    it('should render the message', () => {
      const match = Array.from(element?.shadowRoot?.childNodes || []).find(
        (item) => item.textContent === 'error validation message'
      );

      expect(match).not.toBeNull();
    });
  });

  describe('when custom content is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-error-message>
          <p>custom error content</p>
        </oryx-error-message>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should not render an error icon', () => {
      expect(
        element?.shadowRoot?.querySelector('oryx-icon[type=error]')
      ).toBeNull();
    });
  });
});
