import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { a11yConfig } from '../a11y';
import {
  queryAssignedElements,
  queryFirstAssigned,
  queryFirstFocusable,
} from './query.util';

@customElement('fake-element')
class FakeComponent extends LitElement {
  render(): TemplateResult {
    return html`
      <slot>
        <input id="shadow" aria-label="shadow" />
      </slot>

      <slot name="first"></slot>
      <slot name="second">
        <span id="foo"></span>
        <span id="bar"></span>
      </slot>
    `;
  }
}

@customElement('no-slot-element')
class NoSlotComponent extends LitElement {
  render(): TemplateResult {
    return html``;
  }
}
@customElement('fake-container')
class FakeContainer extends LitElement {
  render(): TemplateResult {
    return html`
      <slot></slot>
      <input id="root-input" />
      <div id="container">
        <input id="input" />
      </div>
      <div id="empty-container">
        <span>1</span>
      </div>
    `;
  }
}

describe('QueryUtil', () => {
  describe('wc', () => {
    let element: FakeComponent | NoSlotComponent;

    describe('no shadow root element', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-element></fake-element>`);
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      describe('when non wc element is queried', () => {
        it('should not return any assigned elements', () => {
          const invalidElement = element.renderRoot?.querySelector('#foo');
          const el = queryAssignedElements(invalidElement as LitElement, {
            selector: 'input',
            flatten: true,
          });
          expect(el?.length).toBe(0);
        });
      });
    });

    describe('shadow', () => {
      describe('default slot', () => {
        beforeEach(async () => {
          element = await fixture(html`<fake-element></fake-element>`);
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should find all shadow DOM', () => {
          const el = queryAssignedElements(element, {
            selector: 'input',
            flatten: true,
          });
          expect(el?.length).toBe(1);
        });

        it('should find all shadow DOM', () => {
          const el = queryFirstAssigned<HTMLInputElement>(element, {
            selector: 'input',
            flatten: true,
          });
          expect(el?.id).toBe('shadow');
        });

        it('should not find any shadow DOM', () => {
          const el = queryAssignedElements(element, {
            selector: 'span',
          });
          expect(el?.length).toBe(0);
        });

        it('should not find element from shadow DOM', () => {
          const el = queryAssignedElements(element, {
            selector: 'span',
          });
          expect(el.length).toBe(0);
        });
      });

      describe('named slot', () => {
        it('should not find any elements for first slot', () => {
          const el = queryAssignedElements(element, { slot: 'first' });
          expect(el.length).toBe(0);
        });

        it('should not find shadow elements for second slot', () => {
          const el = queryAssignedElements(element, {
            slot: 'second',
            flatten: true,
          });
          expect(el.length).toBe(2);
        });
      });

      describe('no slot', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<no-slot-element
              ><input aria-label="some label"
            /></no-slot-element>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not find any assigned nodes', () => {
          const el = queryAssignedElements(element, {});
          expect(el.length).toBe(0);
        });

        it('should not find specific assigned nodes', () => {
          const el = queryAssignedElements(element, {
            selector: 'input',
          });
          expect(el.length).toBe(0);
        });
      });
    });
  });

  describe('queryFirstFocusable', () => {
    let element: FakeContainer;

    describe('query first focusable element', () => {
      beforeEach(async () => {
        element = await fixture(html` <fake-container></fake-container> `);
      });

      it('should not found focusable element', () => {
        const parent = element.shadowRoot?.getElementById('empty-container');
        const firstFocusable = queryFirstFocusable(parent as HTMLElement);
        expect(firstFocusable).toBeNull();
      });

      it('should find #input', () => {
        const parent = element.shadowRoot?.getElementById('container');
        const target = element.shadowRoot?.getElementById('input');
        const firstFocusable = queryFirstFocusable(parent as HTMLElement);
        expect(firstFocusable).toBe(target);
      });

      it('should find #slot-input', () => {
        const target = element.shadowRoot?.getElementById('root-input');
        const firstFocusable = queryFirstFocusable(element);
        expect(firstFocusable).toBe(target);
      });
    });
  });
});
