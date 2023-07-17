import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { hydrate, HYDRATE_ON_DEMAND } from './hydrate';

@customElement('mock-component')
@hydrate()
export class MockComponent extends LitElement {
  render(): TemplateResult {
    return html`rendered content`;
  }
}

describe('hydratable decorator', () => {
  let element: LitElement;

  beforeEach(async () => {
    element = await fixture(html`<mock-component></mock-component>`);
  });

  it('should have hydratable attribute', () => {
    expect(element.hasAttribute('hydratable')).toBeTruthy();
  });

  it('should have a hydrate on demand function', () => {
    expect((element as any)[HYDRATE_ON_DEMAND]).not.toBeUndefined();
  });
});
