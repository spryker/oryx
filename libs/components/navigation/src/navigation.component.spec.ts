import { expect, fixture, html } from '@open-wc/testing';
import './index';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let element: NavigationComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-navigation');
    expect(el).to.be.instanceof(NavigationComponent);
  });

  describe('collapse', () => {
    describe('when the component is created', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-navigation> </oryx-navigation>`);
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
      it('should have a collapsed attribute', () => {
        expect(element.hasAttribute('collapsed')).to.be.true;
      });
    });
  });
});
