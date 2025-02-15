import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { elementEffect } from './element-effect';

@customElement('mock-effect-component')
class MockEffectComponent extends LitElement {
  mockEffectCallback = vi.fn();
  mockAnotherEffectCallback = vi.fn();

  @elementEffect()
  mockEffect = () => this.mockEffectCallback();

  @elementEffect()
  mockAnotherEffect = () => this.mockAnotherEffectCallback();

  @property()
  test = 'new';
}

describe('elementEffect decorator', () => {
  let element: MockEffectComponent;

  beforeEach(async () => {
    element = await fixture(
      html`<mock-effect-component></mock-effect-component>`
    );
  });

  it('should invoke effects on connectedCallback hook', async () => {
    await nextFrame();

    expect(element.mockEffectCallback).toHaveBeenCalled();
    expect(element.mockAnotherEffectCallback).toHaveBeenCalled();
  });

  it('should invoke effects on property update', async () => {
    element.test = 'updated';
    await element.updateComplete;

    expect(element.mockEffectCallback).toHaveBeenCalled();
    expect(element.mockAnotherEffectCallback).toHaveBeenCalled();
  });
});
