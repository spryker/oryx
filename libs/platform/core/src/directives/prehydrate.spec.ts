import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { preHydrate } from './prehydrate';

const TAG_NAME = 'mock-component';

@customElement(TAG_NAME)
export class MockComponent extends LitElement {
  render(): TemplateResult {
    return html`<div></div>
      ${preHydrate(() => {
        console.log('mock inline script called');
      }, TAG_NAME)}`;
  }
}

@customElement('another-mock-component')
export class AnotherMockComponent extends LitElement {
  render(): TemplateResult {
    return html`<span></span> ${preHydrate(() => {
        console.log('another inline script called');
      }, 'another-mock-component')}`;
  }
}

describe('directive', () => {
  let element: MockComponent;

  beforeEach(async () => {
    element = await fixture(html`<mock-component></mock-component>`);
  });

  it('should render treewalk, function and drylogic script tags the first time', async () => {
    const script = element.shadowRoot?.querySelector('script');
    expect(script).not.toBeNull();
    expect(script?.innerText).toContain('getNextElement');
    expect(script?.innerText).toContain('mock inline script called');
    expect(script?.innerText).toContain('__dryFn');
  });

  it('should render only dryLogic script tag in subsequent components of the same type', async () => {
    const script = element.shadowRoot?.querySelector('script');
    expect(script).not.toBeNull();
    expect(script?.innerText).toContain('__dryFn');
    expect(script?.innerText).not.toContain('getNextElement');
    expect(script?.innerText).not.toContain('mock inline script called');
  });

  it('should still load function script tag in another component', async () => {
    const anotherComponent = await fixture(
      html`<another-mock-component></another-mock-component>`
    );
    const script = anotherComponent.shadowRoot?.querySelector('script');
    expect(script).not.toBeNull();
    expect(script?.innerText).not.toContain('getNextElement');
    expect(script?.innerText).toContain('another inline script called');
  });
});
