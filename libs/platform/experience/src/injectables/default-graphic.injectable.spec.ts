import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { AppRef } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { computed, signalAware, signalProperty } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { DefaultGraphicInjectable } from './default-graphic.injectable';

@signalAware()
@customElement('mock-component')
class MockComponent extends LitElement {
  @signalProperty() url?: string;
  @signalProperty() source?: string;

  protected injectable = new DefaultGraphicInjectable();
  protected _url = computed(() => this.injectable.getUrl(this.url ?? ''));
  protected _source = computed(() =>
    this.injectable.getSource(this.source ?? '')
  );

  render(): TemplateResult {
    if (this.url) return html`${this._url()}`;
    if (this.source) return html`${this._source()}`;
    return html``;
  }
}

const mockResource = {
  getGraphic: vi.fn(),
  getGraphics: vi.fn(),
};

const mockApp = {
  requirePlugin: vi.fn().mockReturnValue(mockResource),
};

describe('DefaultGraphicInjectable', () => {
  let element: MockComponent;

  beforeEach(async () => {
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
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('getUrl', () => {
    it('should return url from resource plugin', async () => {
      mockResource.getGraphic.mockReturnValue('url-content');
      element.url = 'urlToken';
      await nextFrame();
      expect(mockResource.getGraphic).toHaveBeenCalledWith('urlToken', 'url');
      expect(element.renderRoot.textContent).toContain('url-content');
    });
  });

  describe('getSource', () => {
    it('should return source html from resource plugin', async () => {
      mockResource.getGraphic.mockReturnValue('<svg></svg>');
      element.url = '';
      element.source = 'sourceToken';
      await nextFrame();
      expect(mockResource.getGraphic).toHaveBeenCalledWith(
        'sourceToken',
        'source'
      );
      expect(element).toContainElement('svg');
    });
  });

  describe('getGraphics', () => {
    it('should return the list of graphics from ResourcePlugin', () => {
      const mockGraphics = { a: 'a', b: 'b' };
      mockResource.getGraphics.mockReturnValue(mockGraphics);
      expect(new DefaultGraphicInjectable().getGraphics()).toEqual(
        mockGraphics
      );
    });
  });
});
