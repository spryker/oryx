import { expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import { a11yConfig } from '../../a11y';
import './index';
import { CollapseToggleController } from './navigation-collapse.controller';

export class FakeComponent extends LitElement {}
customElements.define('fake-element', FakeComponent);

describe('CollapseToggleController', () => {
  let element: FakeComponent;
  let controller: CollapseToggleController;

  const expectsCollapsed = (collapsed: boolean): void => {
    expect(element.hasAttribute('collapsed')).to.be.eq(collapsed);
    expect(element.style.getPropertyValue('--navigation-collapsed')).to.be.eq(
      collapsed ? '1' : '0'
    );
  };

  beforeEach(async () => {
    element = await fixture(html`<fake-element> </fake-element>`);
    controller = new CollapseToggleController(element);
  });

  describe('toggle', () => {
    it('should collapse by default', () => {
      expect(element.hasAttribute('collapsed')).to.be.true;
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    describe('when toggled', () => {
      beforeEach(() => {
        controller.toggle();
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have a collapse attribute', () => {
        expect(element.hasAttribute('collapsed')).to.be.false;
      });
    });

    describe('when toggled twice', () => {
      beforeEach(() => {
        controller.toggle();
        controller.toggle();
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should have a collapse attribute', () => {
        expect(element.hasAttribute('collapsed')).to.be.true;
      });
    });
  });

  describe('keyboard events', () => {
    describe('when the "[" key is used', () => {
      it('should toggle the navigation', () => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '[' }));
        expect(element.hasAttribute('collapsed')).to.be.false;
      });
    });

    describe('when other keys are used', () => {
      it('should toggle the navigation', () => {
        expect(element.hasAttribute('collapsed')).to.be.true;
        'abcdefghijklmnopqrstuvwxyz ?]!~#$%'.split('').forEach((key) => {
          element.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
        });
        expect(element.hasAttribute('collapsed')).to.be.true;
      });
    });
  });
});
