import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { AppRef } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DefaultGraphicInjectable } from './default-graphic.injectable';

@customElement('mock-component')
class MockComponent extends LitElement {
  @property()
  url?: string;

  @property()
  source?: string;

  protected injectable = new DefaultGraphicInjectable();

  render(): TemplateResult {
    if (this.url) {
      return html`${this.injectable.getUrl(this.url)}`;
    }

    if (this.source) {
      return html`${this.injectable.getSource(this.source)}`;
    }

    return html``;
  }
}

export const mockGraphic = {
  getGraphicValue: vi.fn(),
};

export const mockApp = {
  findPlugin: vi.fn().mockReturnValue(mockGraphic),
};

describe('DefaultGraphicInjectable', () => {
  let element: MockComponent;

  beforeEach(async () => {
    vi.clearAllMocks();
    createInjector({
      providers: [
        {
          provide: AppRef,
          useValue: mockApp,
        },
      ],
    });
    element = await fixture(html`<mock-component></mock-component>`);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should return url from resource plugin', async () => {
    mockGraphic.getGraphicValue.mockReturnValue('url-content');
    element.url = 'urlToken';
    await nextFrame();
    expect(mockGraphic.getGraphicValue).toHaveBeenCalledWith('urlToken', 'url');
    expect(element.renderRoot.textContent).toContain('url-content');
  });

  it('should return source html from resource plugin', async () => {
    mockGraphic.getGraphicValue.mockReturnValue('<svg></svg>');
    element.url = '';
    element.source = 'sourceToken';
    await nextFrame();
    expect(mockGraphic.getGraphicValue).toHaveBeenCalledWith(
      'sourceToken',
      'source'
    );
    expect(element).toContainElement('svg');
  });
});
