import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { script } from './script';

const TAG_NAME = 'mock-component';

@customElement(TAG_NAME)
export class MockComponent extends LitElement {
  render(): TemplateResult {
    return html`<div></div>
      ${script(`() => {console.log('inline script called');}`, TAG_NAME)}`;
  }
}

@customElement('another-mock-component')
export class AnotherMockComponent extends LitElement {
  render(): TemplateResult {
    return html`<span></span> ${script(
        `() => {console.log('another inline script called');}`,
        'another-mock-component'
      )}`;
  }
}

describe('directive', () => {
  let element: MockComponent;

  beforeEach(async () => {
    element = await fixture(html`<mock-component></mock-component>`);
  });

  it('should render a script tag', async () => {
    expect(element.shadowRoot?.querySelector('script')).not.toBeNull();
  });

  it('should only load script tag once for each component', async () => {
    const anotherElement = await fixture(
      html`<mock-component></mock-component>`
    );
    expect(anotherElement.shadowRoot?.querySelector('script')).toBeNull();
  });

  it('should still load script tag in another component', async () => {
    const anotherComponent = await fixture(
      html`<another-mock-component></another-mock-component>`
    );
    expect(anotherComponent.shadowRoot?.querySelector('script')).not.toBeNull();
  });
});
