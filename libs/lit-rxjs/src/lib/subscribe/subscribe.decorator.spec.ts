import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { finalize, interval, tap } from 'rxjs';
import { subscribe } from './subscribe.decorator';

const tick = 50;
const delay = (ms: number): Promise<unknown> =>
  new Promise((res) => setTimeout(res, ms));

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

  const getElement = (): MockComponent => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return document.body.querySelector('mock-component')!;
  };

  beforeEach(async () => {
    document.body.innerHTML = `<mock-component></mock-component>`;
    await window.happyDOM.whenAsyncComplete();
    element = getElement();
  });

  it('should unsubscribe from observable on disconnectedCallback hook', () => {
    element.disconnectedCallback();

    expect(element.mockDisconnectedCallback).toHaveBeenCalled();
    expect(element.mockDisconnectedAnotherCallback).toHaveBeenCalled();
  });

  it('should subscribe to observable on connectedCallback hook', async () => {
    await delay(tick + 10);

    expect(element.mockCallback).toHaveBeenCalled();
    expect(element.mockAnotherCallback).toHaveBeenCalled();
  });

  it('should throw an error if initial value is not observable', async () => {
    @customElement('mock-error-component')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class MockErrorComponent extends LitElement {
      @subscribe()
      mock = 'notObservable';
    }

    try {
      document.body.innerHTML = `<mock-error-component></mock-error-component>`;
    } catch (error) {
      expect(error).toBeTypeOf('string');
    }
  });
});
