import { expect, fixture } from '@open-wc/testing';
import { html, LitElement, TemplateResult } from 'lit';
import { QueryAssignedElementsOptions } from 'lit/decorators.js';
import { queryAssignedElements } from './query';

export class FakeComponent extends LitElement {
  render(): TemplateResult {
    return html`
      <slot><p id="bar"></p></slot>
      <slot name="named"></slot>
    `;
  }

  queryAssignedElements(
    options: QueryAssignedElementsOptions = {}
  ): Element[] | undefined {
    return queryAssignedElements(this, options);
  }
}
customElements.define('fake-element', FakeComponent);

describe('InputController', () => {
  let element: FakeComponent;

  describe('any slotted content', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-element>
        <p></p>
        <input />
        <p slot="named"></p>
        <input slot="named" />
        <div slot="named"></div>
      </fake-element>`);
    });

    it('should query assigned elements from main slot', () => {
      const content = element.queryAssignedElements();
      expect(content?.length).to.eq(2);
    });

    it('should query assigned elements from named slot', () => {
      const content = element.queryAssignedElements({ slot: 'named' });
      expect(content?.length).to.eq(3);
    });
  });

  describe('any slotted content', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-element>
        <p></p>
        <input />
        <p slot="named"></p>
        <input slot="named" />
        <div slot="named"></div>
      </fake-element>`);
    });

    it('should query assigned elements from main slot', () => {
      const content = element.queryAssignedElements({ selector: 'input' });
      expect(content?.length).to.eq(1);
      expect(content?.[0].tagName).to.eq('INPUT');
    });

    it('should query assigned elements from named slot', () => {
      const content = element.queryAssignedElements({
        slot: 'named',
        selector: 'div',
      });
      expect(content?.length).to.eq(1);
      expect(content?.[0].tagName).to.eq('DIV');
    });
  });
});
