import { fixture, html } from '@open-wc/testing-helpers';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import { a11yConfig } from '../../a11y';
import './index';
import { NavigationItemComponent } from './navigation-item.component';

describe('NavigationItemComponent', () => {
  let element: NavigationItemComponent;

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
  });
});
