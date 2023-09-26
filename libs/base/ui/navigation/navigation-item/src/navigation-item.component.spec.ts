import { getShadowElementBySelector } from '@/tools/testing';
import { fixture, html } from '@open-wc/testing-helpers';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { navigationComponent } from '../../navigation/src/component';
import { NavigationComponent } from '../../navigation/src/navigation.component';
import { navigationItemComponent } from './component';
import { NavigationItemComponent } from './navigation-item.component';

describe('NavigationItemComponent', () => {
  let element: NavigationItemComponent;
  let parentElement: NavigationComponent;

  const update = async (): Promise<void> => {
    element.requestUpdate();
    await element.updateComplete;
  };

  beforeAll(async () => {
    await useComponent(navigationItemComponent);
    await useComponent(navigationComponent);
  });

  it('is defined', () => {
    const el = document.createElement('oryx-navigation-item');
    expect(el).toBeInstanceOf(NavigationItemComponent);
  });

  describe('icon', () => {
    describe('when no icon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-navigation-item></oryx-navigation-item>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not render an oryx-icon element', () => {
        expect(
          getShadowElementBySelector(element, 'slot[name=icon] > oryx-icon')
        ).toBeNull();
      });
    });

    describe('when an icon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-navigation-item icon="search"></oryx-navigation-item>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should render an oryx-icon element', () => {
        expect(
          getShadowElementBySelector(element, 'slot[name=icon] > oryx-icon')
        ).not.toBeNull();
      });
    });

    describe('when parent component is collapsed', () => {
      beforeEach(async () => {
        parentElement = await fixture(
          html`
            <oryx-navigation collapsed>
              <oryx-navigation-item></oryx-navigation-item>
            </oryx-navigation>
          `
        );
      });

      it('should render set parent-collapsed attribute', () => {
        expect(
          parentElement.firstElementChild?.hasAttribute('parent-collapsed')
        ).toBe(true);
      });

      it('should toggle parent-collapsed attribute depending on parent component attribute', async () => {
        parentElement.removeAttribute('collapsed');
        await update();

        expect(
          parentElement.firstElementChild?.hasAttribute('parent-collapsed')
        ).toBe(false);

        parentElement.setAttribute('collapsed', 'true');
        await update();

        expect(
          parentElement.firstElementChild?.hasAttribute('parent-collapsed')
        ).toBe(true);
      });
    });
  });
});
