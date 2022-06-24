import { fixture } from '@open-wc/testing-helpers';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import { a11yConfig, queryFirstAssigned } from '@spryker-oryx/typescript-utils';
import { html } from 'lit';
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

      expect(input).not.toBeNull();
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
      const input = getShadowElementBySelector(element, 'input');

      expect(input).not.toBeNull();
    });
  });
});
