import { fixture } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing/a11y';
import { html } from 'lit';
import { a11yConfig } from '../../a11y';
import { OptionComponent } from './';
import './index';

/** innnerText is not implemented in jsdom */
Object.defineProperty(Element.prototype, 'innerText', {
  set: function (value: unknown) {
    this.textContent = value;
  },
  get: function () {
    return this?.textContent;
  },
});

describe('OptionComponent', () => {
  let element: OptionComponent;

  describe('when an icon is given', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-option .icon=${'mock'}></oryx-option>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should render the icon inside the option', () => {
      expect(
        element.shadowRoot?.querySelector(`oryx-icon:not(.mark)`)
      ).toBeDefined();
    });
  });

  describe('values', () => {
    describe('when the item has no value', () => {
      beforeEach(async () => {
        const parent = await fixture(
          html`<div><oryx-option>mock inner text</oryx-option></div>`
        );
        element = parent.querySelector('oryx-option') as OptionComponent;
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should return the innerText', () => {
        expect(element.value).toEqual('mock inner text');
      });
    });

    describe('when the item has a value', () => {
      beforeEach(async () => {
        const parent = await fixture(
          html`<div>
            <oryx-option value="mock value">mock inner text</oryx-option>
          </div>`
        );
        element = parent.querySelector('oryx-option') as OptionComponent;
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should return the innerText', () => {
        expect(element.value).toEqual('mock value');
      });
    });
  });
});
