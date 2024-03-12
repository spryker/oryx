import { getShadowElementBySelector } from '@/tools/testing';
import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LitElement, ReactiveControllerHost, TemplateResult, html } from 'lit';
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
  describe('template', () => {
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

      element = await fixture(
        html`<controller-component></controller-component> `
      );
    });

    afterEach(() => {
      destroyInjector();
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

  describe('provide method', () => {
    const mockElement = {
      addController: vi.fn(),
    } as unknown as ReactiveControllerHost & Element;
    let controller: ContextController;
    const mockContextService = {
      remove: vi.fn(),
      provide: vi.fn(),
      get: vi.fn(),
    };

    beforeEach(async () => {
      createInjector({
        providers: [
          {
            provide: ContextService,
            useValue: mockContextService,
          },
        ],
      });

      controller = new ContextController(mockElement);
    });

    afterEach(() => {
      vi.clearAllMocks();
      destroyInjector();
    });

    it('should call provide method of ContextService', () => {
      controller.provide(mockKey, mockData);

      expect(mockContextService.provide).toHaveBeenCalledWith(
        mockElement,
        mockKey,
        mockData
      );
    });

    it('should call remove method of ContextService if value is undefined', () => {
      controller.provide(mockKey, undefined);

      expect(mockContextService.remove).toHaveBeenCalledWith(
        mockElement,
        mockKey
      );
      expect(mockContextService.provide).not.toHaveBeenCalled();
    });
  });
});
