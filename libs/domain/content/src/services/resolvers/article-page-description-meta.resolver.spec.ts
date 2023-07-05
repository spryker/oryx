import { ContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { of } from 'rxjs';
import { ContentFields, ContentService } from '../content.service';
import { ArticlePageDescriptionMetaResolver } from './article-page-description-meta.resolver';

const mockContentService = {
  get: vi.fn(),
};

const mockContextService = {
  get: vi.fn(),
};

const mockRouterService = {
  currentRoute: vi.fn(),
};

describe('ArticlePageDescriptionMetaResolver', () => {
  let service: ArticlePageDescriptionMetaResolver;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ArticlePageDescriptionMetaResolver,
          useClass: ArticlePageDescriptionMetaResolver,
        },
        {
          provide: ContextService,
          useValue: mockContextService,
        },
        {
          provide: ContentService,
          useValue: mockContentService,
        },
        {
          provide: RouterService,
          useValue: mockRouterService,
        },
      ],
    });

    service = testInjector.inject(ArticlePageDescriptionMetaResolver);
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  describe('getScore', () => {
    it('should return proper value if product exist', () => {
      const callback = vi.fn();
      mockContextService.get.mockReturnValueOnce(of('id'));
      mockContextService.get.mockReturnValue(of('type'));
      mockRouterService.currentRoute.mockReturnValue(
        of(`/${ContentFields.Article}/saf`)
      );
      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(['id', 'type', true]);
    });

    it('should return proper value if product is not exist', () => {
      const callback = vi.fn();
      mockContextService.get.mockReturnValue(of(undefined));
      mockRouterService.currentRoute.mockReturnValue(of(''));

      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith([undefined, undefined, false]);
    });
  });

  describe('resolve', () => {
    it('should return proper object with product description', () => {
      const callback = vi.fn();
      mockContextService.get.mockReturnValueOnce(of('id'));
      mockContextService.get.mockReturnValue(of('type'));
      mockContentService.get.mockReturnValue(
        of({
          description: 'Name A',
        })
      );
      service.resolve().subscribe(callback);
      expect(mockContentService.get).toHaveBeenCalledWith({
        id: 'id',
        type: 'type',
        entities: [ContentFields.Article, ContentFields.Faq],
      });
      expect(callback).toHaveBeenCalledWith({
        description: 'Name A',
      });
    });
  });
});
