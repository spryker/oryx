import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector, resolve } from '@spryker-oryx/di';
import { LitElement, TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { firstValueFrom, lastValueFrom, of } from 'rxjs';
import { afterEach } from 'vitest';
import {
  ContextFallback,
  ContextSerializer,
  ContextService,
} from './context.service';
import { DefaultContextService } from './default-context.service';

const mockKey = 'mockKey';
const mockKeyFallback = 'mockKeyFallback';
const mockFallbackValue = 'mockFallbackValue';
const mockObject = {
  name: 'name',
  value: 'value',
};

@customElement('overlay-parent-context')
export class OverlayParentContext extends LitElement {
  context = resolve(ContextService);

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

@customElement('shadow-parent-context')
export class ShadowParentContext extends LitElement {
  context = resolve(ContextService);

  protected override render(): TemplateResult {
    return html`<test-child-context></test-child-context>`;
  }
}

@customElement('test-child-context')
export class TestChildContext extends LitElement {
  context = resolve(ContextService);
}

const mockSerializerKey = 'mockSerializerKey';
const mockSerializedValue = 'serializedValue';
const mockDeserializedValue = { key: 'value' };

describe('ContextService', () => {
  let element: OverlayParentContext;

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
        {
          provide: `${ContextFallback}${mockKeyFallback}`,
          useValue: of(mockFallbackValue),
        },
        {
          provide: `${ContextSerializer}${mockSerializerKey}`,
          useValue: {
            serialize: vi.fn(() => of(mockSerializedValue)),
            deserialize: vi.fn(() => of(mockDeserializedValue)),
          },
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  const testChildContext = (shadow = false): TestChildContext => {
    const currentElement = shadow ? element.shadowRoot : element;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return currentElement!.querySelector(
      'test-child-context'
    ) as TestChildContext;
  };

  describe('imperative', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <overlay-parent-context>
          <test-child-context></test-child-context>
        </overlay-parent-context>
      `);
    });

    it('should add data attribute with stringified value', () => {
      element.context.provide(element, mockKey, mockObject);

      expect(element.getAttribute(`data-${mockKey}`)).toBe(
        JSON.stringify(mockObject)
      );
    });

    it('should get context from the parent element by key', () => {
      const mockCallback = vi.fn();

      element.context.provide(element, mockKey, mockObject);
      testChildContext()
        .context.get(testChildContext(), mockKey)
        .subscribe(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(mockObject);
    });

    it('should be reactive', () => {
      const mockCallback = vi.fn();
      const mockReactive = 'mockReactive';

      element.context.provide(element, mockKey, mockObject);
      testChildContext()
        .context.get(testChildContext(), mockKey)
        .subscribe(mockCallback);

      element.context.provide(element, mockKey, mockReactive);

      expect(mockCallback).toHaveBeenNthCalledWith(1, mockObject);
      expect(mockCallback).toHaveBeenNthCalledWith(2, mockReactive);
    });

    it('should emit value if providing happened after subscribing', () => {
      const mockCallback = vi.fn();

      testChildContext()
        .context.get(testChildContext(), mockKey)
        .subscribe(mockCallback);

      element.context.provide(element, mockKey, mockObject);

      expect(mockCallback).toHaveBeenNthCalledWith(1, undefined);
      expect(mockCallback).toHaveBeenNthCalledWith(2, mockObject);
    });

    it('should remove attribute and emit undefined', () => {
      const mockCallback = vi.fn();

      element.context.provide(element, mockKey, mockObject);

      testChildContext()
        .context.get(testChildContext(), mockKey)
        .subscribe(mockCallback);

      expect(element.hasAttribute(`data-${mockKey}`)).toBe(true);

      element.context.remove(element, mockKey);

      expect(element.hasAttribute(`data-${mockKey}`)).toBe(false);
      expect(mockCallback).toHaveBeenCalledWith(undefined);
    });
  });

  describe('declarative', () => {
    it('should get context from the parent element by key', async () => {
      const mockCallback = vi.fn();

      element = await fixture(html`
        <overlay-parent-context data-mockKey=${JSON.stringify(mockObject)}>
          <test-child-context></test-child-context>
        </overlay-parent-context>
      `);

      testChildContext()
        .context.get(testChildContext(), mockKey)
        .subscribe(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(mockObject);
    });

    it('should recognize context if property is not stringified', async () => {
      const mockCallback = vi.fn();

      element = await fixture(html`
        <!-- @ts-ignore  -->
        <overlay-parent-context data-mockKey=${mockObject}>
          <test-child-context></test-child-context>
        </overlay-parent-context>
      `);

      testChildContext()
        .context.get(testChildContext(), mockKey)
        .subscribe(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith('[object Object]');
    });

    it('should recognize context if property is string', async () => {
      const mockString = '';
      const mockCallback = vi.fn();

      element = await fixture(html`
        <overlay-parent-context data-mockKey=${mockString}>
          <test-child-context></test-child-context>
        </overlay-parent-context>
      `);

      testChildContext()
        .context.get(testChildContext(), mockKey)
        .subscribe(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(mockString);
    });
  });

  describe('with ShadowDom', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<shadow-parent-context></shadow-parent-context>`
      );
    });

    it('should get context from the parent element by key', () => {
      const mockCallback = vi.fn();

      element.context.provide(element, mockKey, mockObject);

      testChildContext(true)
        .context.get(testChildContext(true), mockKey)
        .subscribe(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(mockObject);
    });
  });

  describe('when context is not provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <overlay-parent-context>
          <test-child-context></test-child-context>
        </overlay-parent-context>
      `);
    });

    it('should use fallback value if provided', () => {
      const mockCallback = vi.fn();

      testChildContext()
        .context.get(testChildContext(), mockKeyFallback)
        .subscribe(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(mockFallbackValue);
    });

    it('should use fallback value if null is passed', () => {
      const mockCallback = vi.fn();
      element.context.provide(element, mockKey, mockObject);

      testChildContext()
        .context.get(null, mockKeyFallback)
        .subscribe(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(mockFallbackValue);
    });
  });

  describe('Context Serializers', () => {
    it('should use the correct serializer for serialization', async () => {
      const mockValue = { some: 'data' };

      const a = await lastValueFrom(
        element.context.serialize(mockSerializerKey, mockValue)
      );

      expect(a).toBe(mockSerializedValue);
    });

    it('should fall back to JSON serialization when no serializer is provided', () => {
      const mockValue = { some: 'data' };
      const noSerializerKey = 'noSerializerKey';

      element.context
        .serialize(noSerializerKey, mockValue)
        .subscribe((serializedValue) => {
          expect(serializedValue).toEqual(JSON.stringify(mockValue));
        });
    });

    it('should serialize the value using the provided serializer', () => {
      const mockValue = { some: 'data' };

      element.context.provide(element, mockSerializerKey, mockValue);

      expect(element.getAttribute(`data-${mockSerializerKey}`)).toBe(
        mockSerializedValue
      );
    });

    it.only('should deserialize the value using the provided serializer', async () => {
      element = await fixture(html`
        <!-- @ts-ignore  -->
        <overlay-parent-context data-mockSerializerKey=${mockSerializedValue}>
          <test-child-context></test-child-context>
        </overlay-parent-context>
      `);

      const value = await firstValueFrom(
        element.context.get(element, mockSerializerKey)
      );
      expect(value).toEqual(mockDeserializedValue);
    });
  });
});
