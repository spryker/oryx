import { fixture } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing/a11y';
import { html } from 'lit';
import { a11yConfig } from '../../../a11y';
import { queryFirstAssigned } from '../../../utilities';
import './index';
import { ToggleComponent } from './toggle.component';

describe('Toggle component', () => {
  let element: ToggleComponent;

  describe('when input is slotted', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-toggle>
          <input type="checkbox" aria-label="make a11y happy" />
        </oryx-toggle>
      `);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should render slotted input', () => {
      const input = queryFirstAssigned(element, {
        selector: 'input',
      }) as HTMLInputElement;

      expect(input).to.exist;
    });
  });

  describe('when nothing is slotted', () => {
    beforeEach(async () => {
      element = await fixture(html` <oryx-toggle></oryx-toggle> `);
    });

    it('fails the a11y audit', async () => {
      await expect(element).shadowDom.not.to.be.accessible(a11yConfig);
    });

    it('should render default slot input', () => {
      const input = element.shadowRoot?.querySelector('input');

      expect(input).to.exist;
    });
  });
});
