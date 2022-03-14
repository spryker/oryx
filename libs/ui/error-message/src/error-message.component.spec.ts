import { expect, fixture, html } from '@open-wc/testing';
import { a11yConfig } from '../../a11y';
import { ErrorMessageComponent } from './error-message.component';
import './index';

describe('ErrorMessageComponent', () => {
  let element: ErrorMessageComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-error-message');
    expect(el).to.be.instanceof(ErrorMessageComponent);
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
      expect(element?.shadowRoot?.querySelector('oryx-icon[type=warning]')).to
        .exist;
    });

    it('should render the message', () => {
      expect(element?.shadowRoot?.innerHTML).to.contain(
        'error validation message'
      );
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
      expect(element?.shadowRoot?.querySelector('oryx-icon[type=error]')).not.to
        .exist;
    });
  });
});
