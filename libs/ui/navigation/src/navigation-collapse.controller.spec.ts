import { expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit';
import './index';
import { CollapseToggleController } from './navigation-collapse.controller';

export class FakeComponent extends LitElement {}
customElements.define('fake-element', FakeComponent);

describe('CollapseToggleController', () => {
  let element: FakeComponent;
  let controller: CollapseToggleController;

  beforeEach(async () => {
    element = await fixture(html`<fake-element> </fake-element>`);
    controller = new CollapseToggleController(element);
  });

  describe('toggle', () => {
    it('should collapse by default', () => {
      expect(element.hasAttribute('collapsed')).to.be.true;
    });

    describe('when toggled', () => {
      it('should not have a collapse attribute', () => {
        controller.toggle();
        expect(element.hasAttribute('collapsed')).to.be.false;
      });
    });

    describe('when toggled twice', () => {
      it('should have a collapse attribute', () => {
        controller.toggle();
        controller.toggle();
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
