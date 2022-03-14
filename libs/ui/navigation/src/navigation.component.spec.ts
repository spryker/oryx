import { expect, fixture, html } from '@open-wc/testing';
import { a11yConfig } from '../../a11y';
import './index';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let element: NavigationComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-navigation');
    expect(el).to.be.instanceof(NavigationComponent);
  });

  describe('collapse', () => {
    describe('when custom toggle button aria label is provided', () => {
      const toggleButtonAriaLabel = 'custom aria label';

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-navigation .toggleButtonAriaLabel=${toggleButtonAriaLabel}>
          </oryx-navigation>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should apply custom aria label', () => {
        const button = element.shadowRoot?.querySelector('button');
        expect(button).attribute('aria-label').to.equal(toggleButtonAriaLabel);
      });
    });

    describe('when the component is created', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-navigation> </oryx-navigation>`);
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should apply default aria label', () => {
        const button = element.shadowRoot?.querySelector('button');
        expect(button).attribute('aria-label').to.equal('collapse navigation');
      });

      it('should have a collapsed attribute', () => {
        expect(element.hasAttribute('collapsed')).to.be.true;
      });
    });

    describe('when the collapse button is clicked', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-navigation> </oryx-navigation>`);
        element.shadowRoot?.querySelector('button')?.click();
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have a collapsed attribute', () => {
        expect(element.hasAttribute('collapsed')).to.be.false;
      });
    });

    describe('when the collapse button is clicked twice', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-navigation> </oryx-navigation>`);
        element.shadowRoot?.querySelector('button')?.click();
        element.shadowRoot?.querySelector('button')?.click();
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should have a collapsed attribute', () => {
        expect(element.hasAttribute('collapsed')).to.be.true;
      });
    });
  });
});
