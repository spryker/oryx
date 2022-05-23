import { fixture } from '@open-wc/testing-helpers';
import { ContextService } from '@spryker-oryx/core';
import { createInjector, resolve } from '@spryker-oryx/injector';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { finalize } from 'rxjs';
import { SSRStreamParserService } from './default-ssr-stream-parser';
import { ServerContextService } from './server-context.service';

const mockKey = 'mockKey';
const mockObject = {
  name: 'name',
  value: 'value',
};

vi.mock('./default-ssr-stream-parser.ts', () => {
  return {
    DefaultSSRStreamParserService: class implements SSRStreamParserService {
      fillStream = vi.fn();
      getStreamStack(): Record<string, string>[] {
        return [
          {
            mockKey: JSON.stringify(mockObject),
          },
        ];
      }
    },
  };
});

@customElement('overlay-parent-context')
export class OverlayParentContext extends LitElement {
  context = resolve(this, ContextService);

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

@customElement('test-child-context')
export class TestChildContext extends LitElement {
  context = resolve(this, ContextService);
}

describe('SSRContextService', () => {
  let element: OverlayParentContext;

  beforeEach(async () => {
    createInjector({
      override: true,
      providers: [
        {
          provide: ContextService,
          useClass: ServerContextService,
        },
      ],
    });
  });

  const testChildContext = (shadow = false): TestChildContext => {
    const currentElement = shadow ? element.shadowRoot : element;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return currentElement!.querySelector(
      'test-child-context'
    ) as TestChildContext;
  };

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

  it('should remove attribute and complete stream', () => {
    const mockCallback = vi.fn();

    element.context.provide(element, mockKey, mockObject);
    testChildContext()
      .context.get(testChildContext(), mockKey)
      .pipe(finalize(mockCallback))
      .subscribe();

    expect(element.hasAttribute(`data-${mockKey}`)).toBe(true);

    element.context.remove(element, mockKey);

    expect(element.hasAttribute(`data-${mockKey}`)).toBe(false);
    expect(mockCallback).toHaveBeenCalled();
  });
});
