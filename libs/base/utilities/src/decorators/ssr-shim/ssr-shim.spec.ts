import { fixture } from '@open-wc/testing-helpers';
import * as utilities from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ssrShim } from './ssr-shim';

const spy = vi.spyOn(utilities, 'ssrStyleShim');

@ssrShim('')
@customElement('mock-vanilla-component')
export class MockVanillaComponent extends LitElement {
  render(): TemplateResult {
    return html`rendered content`;
  }
}

@ssrShim('style')
@customElement('mock-ssr-component')
export class MockSsrComponent extends LitElement {
  render(): TemplateResult {
    return html`rendered content`;
  }
}

describe('ssrShim decorator', () => {
  let element: LitElement;

  describe('when ssrShim is used with non-existing feature', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<mock-vanilla-component></mock-vanilla-component>`
      );
    });

    it('should not call ssrStyleShim', () => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when ssrShim uses style feature', () => {
    beforeEach(async () => {
      element = await fixture(html`<mock-ssr-component></mock-ssr-component>`);
    });

    it('should call ssrStyleShim', () => {
      expect(spy).toHaveBeenCalledWith(MockSsrComponent);
    });
  });
});
