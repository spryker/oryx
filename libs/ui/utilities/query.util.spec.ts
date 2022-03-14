import { expect, fixture } from '@open-wc/testing';
import { html, LitElement, TemplateResult } from 'lit';
import { a11yConfig } from '../a11y';
import { queryAssignedElements, queryFirstAssigned } from './query.util';

export class FakeComponent extends LitElement {
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
customElements.define('fake-element', FakeComponent);

export class NoSlotComponent extends LitElement {
  render(): TemplateResult {
    return html``;
  }
}
customElements.define('no-slot-element', NoSlotComponent);

describe('QueryUtil', () => {
  describe('wc', () => {
    let element: FakeComponent;

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
          expect(el?.length).to.eq(0);
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
          expect(el?.length).to.eq(1);
        });

        it('should find all shadow DOM', () => {
          const el = queryFirstAssigned<HTMLInputElement>(element, {
            selector: 'input',
            flatten: true,
          });
          expect(el?.id).to.eq('shadow');
        });

        it('should not find any shadow DOM', () => {
          const el = queryAssignedElements(element, {
            selector: 'span',
          });
          expect(el?.length).to.eq(0);
        });

        it('should not find element from shadow DOM', () => {
          const el = queryAssignedElements(element, {
            selector: 'span',
          });
          expect(el).to.be.empty;
        });
      });

      describe('named slot', () => {
        it('should not find any elements for first slot', () => {
          const el = queryAssignedElements(element, { slot: 'first' });
          expect(el.length).to.eq(0);
        });

        it('should not find shadow elements for second slot', () => {
          const el = queryAssignedElements(element, {
            slot: 'second',
            flatten: true,
          });
          expect(el.length).to.eq(2);
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
          expect(el.length).to.eq(0);
        });

        it('should not find specific assigned nodes', () => {
          const el = queryAssignedElements(element, {
            selector: 'input',
          });
          expect(el.length).to.eq(0);
        });
      });
    });
  });
});
