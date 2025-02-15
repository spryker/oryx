import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { signal } from '../signal';
import { signalAware } from './signal-aware';

@customElement('mock-signal-aware-component')
@signalAware()
class MockSignalAwareComponent extends LitElement {
  mockSignal = signal(42);
}

describe('signalAware decorator', () => {
  let element: MockSignalAwareComponent;

  beforeEach(async () => {
    element = await fixture(
      html`<mock-signal-aware-component></mock-signal-aware-component>`
    );
  });

  it('should instantiate SignalController for a custom element using signalAware decorator', async () => {
    await nextFrame();
    expect((element as any)[Symbol.for('SignalController')]).toBeDefined();
  });

  it('should properly set up a signal on a custom element using signalAware decorator', async () => {
    await nextFrame();
    expect(element.mockSignal()).toBe(42);
  });
});
