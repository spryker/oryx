import { expect, fixture, html } from '@open-wc/testing';
import './index';
import { NavigationItemComponent } from './navigation-item.component';

describe('NavigationItemComponent', () => {
  let element: NavigationItemComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-navigation-item');
    expect(el).to.be.instanceof(NavigationItemComponent);
  });

  describe('icon', () => {
    describe('when no icon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-navigation-item></oryx-navigation-item>`
        );
      });

      it('should not render an oryx-icon element', () => {
        expect(element.shadowRoot?.querySelector('slot[name=icon] > oryx-icon'))
          .to.not.exist;
      });
    });

    describe('when an icon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-navigation-item icon="search"></oryx-navigation-item>`
        );
      });

      it('should render an oryx-icon element', () => {
        expect(element.shadowRoot?.querySelector('slot[name=icon] > oryx-icon'))
          .to.exist;
      });
    });
  });
});
