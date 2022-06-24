import { fixture } from '@open-wc/testing-helpers';
import { wait } from '@spryker-oryx/typescript-utils';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { finalize, interval, tap } from 'rxjs';
import { subscribe } from './subscribe.decorator';

const tick = 50;
@customElement('mock-component')
class MockComponent extends LitElement {
  mockCallback = vi.fn();
  mockAnotherCallback = vi.fn();
  mockDisconnectedCallback = vi.fn();
  mockDisconnectedAnotherCallback = vi.fn();

  @subscribe()
  mock$ = interval(tick).pipe(
    tap(this.mockCallback),
    finalize(this.mockDisconnectedCallback)
  );

  @subscribe()
  mockAnother$ = interval(tick).pipe(
    tap(this.mockAnotherCallback),
    finalize(this.mockDisconnectedAnotherCallback)
  );

  @property()
  test = 'new';

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }
}

describe('subscribe decorator', () => {
  let element: MockComponent;

  beforeEach(async () => {
    element = await fixture(html`<mock-component></mock-component>`);
  });

  it('should unsubscribe from observable on disconnectedCallback hook', () => {
    element.disconnectedCallback();

    expect(element.mockDisconnectedCallback).toHaveBeenCalled();
    expect(element.mockDisconnectedAnotherCallback).toHaveBeenCalled();
  });

  it('should subscribe to observable on connectedCallback hook', async () => {
    await wait(tick + 10);

    expect(element.mockCallback).toHaveBeenCalled();
    expect(element.mockAnotherCallback).toHaveBeenCalled();
  });
});
