import { fixture, html } from '@open-wc/testing-helpers';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { errorMessageComponent } from './component';
import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  let element: ErrorMessageComponent;

  beforeAll(async () => {
    await useComponent(errorMessageComponent);
  });

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

    it('should render an IconTypes.Warning icon', () => {
      const icon = element?.shadowRoot?.querySelector(`oryx-icon`);
      expect(icon).not.toBeNull();
      expect(icon).toHaveProperty('type', IconTypes.Warning);
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
