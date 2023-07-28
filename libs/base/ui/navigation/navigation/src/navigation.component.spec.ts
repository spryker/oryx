import { fixture, html } from '@open-wc/testing-helpers';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { navigationComponent } from './component';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let element: NavigationComponent;

  beforeAll(async () => {
    await useComponent(navigationComponent);
  });

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
        const button = element.renderRoot.querySelector('oryx-button');
        expect(button).toHaveProperty('label', toggleButtonAriaLabel);
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
        const button = element.renderRoot.querySelector('oryx-button');
        expect(button).toHaveProperty('label', 'collapse navigation');
      });

      it('should have a collapsed attribute', () => {
        expect(element.hasAttribute('collapsed')).toBe(true);
      });
    });

    describe('when the collapse button clicked', () => {
      describe('when the collapse button is clicked first time', () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-navigation> </oryx-navigation>`);
          element.renderRoot.querySelector<HTMLElement>('oryx-button')?.click();
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
          const button =
            element.renderRoot.querySelector<HTMLElement>('oryx-button');
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
