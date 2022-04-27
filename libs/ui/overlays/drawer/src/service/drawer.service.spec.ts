import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement, TemplateResult } from 'lit';
import { DrawerComponent, DrawerService } from '..';
import '../index';

/* eslint-disable */
// @ts-ignore
if (window.HTMLDialogElement) {
  // JsDom doesn't have implementation for open/close dialog
  // @ts-ignore
  window.HTMLDialogElement.prototype.show = function (): void {
    this.setAttribute('open', 'open');
  };
  // @ts-ignore
  window.HTMLDialogElement.prototype.close = function (): void {
    this.removeAttribute('open');
  };
}
/* eslint-enable */
class WrapperComponent extends LitElement {
  render(): TemplateResult {
    return html` <oryx-drawer id="nested-drawer"></oryx-drawer> `;
  }
}

customElements.get('wrapper-component') ||
  customElements.define('wrapper-component', WrapperComponent);

describe('DrawerService', () => {
  let element: DrawerComponent;
  const service = new DrawerService();

  describe('getDrawer', () => {
    describe('without parent param', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-drawer id="drawer"></oryx-drawer>
          <span id="not-drawer"></span>
        `);
      });

      it('should find the drawer by selector', async () => {
        const drawer = service.get({ selector: '#drawer' });
        expect(drawer).toBeDefined();
      });

      it('should throw error when not found', () => {
        expect(() => service.get({ selector: '#fake-selector' })).toThrow();
      });

      it('should throw error when valid drawer element not found', () => {
        expect(() => service.get({ selector: '#not-drawer' })).toThrow();
      });
    });

    describe('with parent param equal html element', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-drawer id="drawer"></oryx-drawer>
        `);
      });

      it('should find nested drawer inside other custom element', async () => {
        const drawer = service.get({ selector: '#drawer', parent: document });
        expect(drawer).toBeDefined();
      });
    });

    describe('with parent param equal custom element', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <wrapper-component></wrapper-component>
        `);
      });

      it('should find nested drawer inside other custom element', async () => {
        const drawer = service.get({
          selector: '#nested-drawer',
          parent: element,
        });
        expect(drawer).toBeDefined();
      });
    });
  });

  describe('toggle', () => {
    let element1: DrawerComponent;

    beforeEach(async () => {
      element = await fixture(html` <oryx-drawer id="drawer1"></oryx-drawer> `);
      element1 = await fixture(html`
        <oryx-drawer id="drawer2"></oryx-drawer>
      `);
    });

    it('should toggle drawer`s state', async () => {
      const drawer = service.get({ selector: '#drawer1' });
      service.toggle({ selector: '#drawer1' });

      drawer.requestUpdate();
      await drawer.updateComplete;
      expect(drawer.dialog?.open).toBe(true);

      service.toggle({ selector: '#drawer1' });

      drawer.requestUpdate();
      await drawer.updateComplete;
      expect(drawer.dialog?.open).toBe(false);
    });

    it('should close other drawers', async () => {
      const drawer1 = service.get({ selector: '#drawer1' });

      service.toggle({ selector: '#drawer1' });
      drawer1.requestUpdate();
      await drawer1.updateComplete;
      expect(drawer1.dialog?.open).toBe(true);

      service.toggle({ selector: '#drawer2' });
      drawer1.requestUpdate();
      await drawer1.updateComplete;
      expect(drawer1.dialog?.open).toBe(false);
    });
  });
});
