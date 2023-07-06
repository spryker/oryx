import { fixture } from '@open-wc/testing-helpers';
import { ContentService } from '@spryker-oryx/content';
import * as core from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ArticleComponent } from './article.component';
import { articleComponent } from './article.def';

const mockContent = 'mockContent';

const mockContentService = {
  get: vi.fn().mockReturnValue({ content: 'mockContent' }),
};

const mockContext = {
  get: vi.fn().mockReturnValue(of(mockContent)),
};

const mockMarkedValue = 'mockMarkedValue';

const mockMarked = {
  parse: vi.fn().mockReturnValue(mockMarkedValue),
};

vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

vi.mock('marked', () => {
  return {
    marked: {
      parse: () => mockMarked.parse(),
    },
  };
});

describe('ArticleComponent', () => {
  let element: ArticleComponent;

  beforeAll(async () => {
    await useComponent(articleComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ContentService,
          useValue: mockContentService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-content-article></oryx-content-article>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(ArticleComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render oryx-text with proper content', async () => {
    const text = element.shadowRoot?.querySelector('oryx-text');

    expect(mockContentService.get).toHaveBeenCalledWith({
      id: mockContent,
      type: mockContent,
    });
    expect(text).toHaveProperty('content', 'mockMarkedValue');
  });

  it('should not render data if content is not exist', async () => {
    mockContentService.get.mockReturnValue(null);
    element = await fixture(
      html`<oryx-content-article></oryx-content-article>`
    );
    const text = element.shadowRoot?.querySelector('oryx-text');
    expect(text).toBeNull();
  });
});
