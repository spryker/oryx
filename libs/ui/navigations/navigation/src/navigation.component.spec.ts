import { fixture, html } from '@open-wc/testing-helpers';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import { a11yConfig } from '@spryker-oryx/typescript-utils';
import './index';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let element: NavigationComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-navigation');
    expect(el).toBeInstanceOf(NavigationComponent);
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
        const button = getShadowElementBySelector(element, 'button');
        expect(button?.getAttribute('aria-label')).toBe(toggleButtonAriaLabel);
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
        const button = getShadowElementBySelector(element, 'button');
        expect(button?.getAttribute('aria-label')).toBe('collapse navigation');
      });

      it('should have a collapsed attribute', () => {
        expect(element.hasAttribute('collapsed')).toBe(true);
      });
    });

    describe('when the collapse button clicked', () => {
      describe('when the collapse button is clicked first time', () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-navigation> </oryx-navigation>`);
          getShadowElementBySelector(element, 'button')?.click();
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have a collapsed attribute', () => {
          expect(element.hasAttribute('collapsed')).toBe(false);
        });
      });

      describe('when the collapse button is clicked second time', () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-navigation> </oryx-navigation>`);
          const button = getShadowElementBySelector(element, 'button');
          button?.click();
          button?.click();
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should have a collapsed attribute', () => {
          expect(element.hasAttribute('collapsed')).toBe(true);
        });
      });
    });
  });
});
