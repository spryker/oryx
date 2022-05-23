import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ContextController } from './context.controller';
import { ContextService } from './context.service';
import { DefaultContextService } from './default-context.service';

const mockKey = 'mockKey';
const mockData = 'mockData';
const mockAnotherData = 'mockAnotherData';

@customElement('controller-component')
class MockController extends LitElement {
  context = new ContextController(this);

  connectedCallback(): void {
    super.connectedCallback();
    this.context.provide(mockKey, mockData);
  }

  protected override render(): TemplateResult {
    return html`
      <intermediate-component></intermediate-component>
      <consumer-component></consumer-component>
    `;
  }
}

@customElement('intermediate-component')
class MockIntermediate extends LitElement {
  context = new ContextController(this);

  connectedCallback(): void {
    super.connectedCallback();
    this.context.provide(mockKey, mockAnotherData);
  }
}

@customElement('consumer-component')
class MockConsumer extends LitElement {
  context = new ContextController(this);
}

describe('ContextController', () => {
  let element: MockController;

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  beforeEach(async () => {
    element = await fixture(
      html`<controller-component></controller-component> `
    );
  });

  it('should reemit on hostConnected if provided value has been changed', () => {
    const mockCallback = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const consumer = getShadowElementBySelector(
      element,
      'consumer-component'
    )! as MockConsumer;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const intermediate = getShadowElementBySelector(
      element,
      'intermediate-component'
    )! as MockIntermediate;

    consumer.context.get(mockKey).subscribe(mockCallback);

    expect(mockCallback).toHaveBeenNthCalledWith(1, mockData);

    intermediate.shadowRoot?.appendChild(consumer);

    expect(mockCallback).toHaveBeenNthCalledWith(2, mockAnotherData);
  });
});
