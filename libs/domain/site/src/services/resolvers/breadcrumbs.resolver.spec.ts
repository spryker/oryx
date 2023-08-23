import { PageMetaResolverService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  DefaultFallbackBreadcrumbsResolver,
  FallbackBreadcrumbsResolver,
} from '@spryker-oryx/site';
import { of } from 'rxjs';

const text = 'test';

class MockPageMetaResolverService implements Partial<PageMetaResolverService> {
  getTitle = vi.fn().mockReturnValue(of(text));
}

describe('DefaultFallbackBreadcrumbsResolver', () => {
  let service: DefaultFallbackBreadcrumbsResolver;
  let pageMetaResolver: MockPageMetaResolverService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: FallbackBreadcrumbsResolver,
          useClass: DefaultFallbackBreadcrumbsResolver,
        },
        {
          provide: PageMetaResolverService,
          useClass: MockPageMetaResolverService,
        },
      ],
    });

    pageMetaResolver = testInjector.inject<MockPageMetaResolverService>(
      PageMetaResolverService
    );
    service = testInjector.inject(FallbackBreadcrumbsResolver);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('resolve', () => {
    const callback = vi.fn();

    beforeEach(() => {
      service.resolve().subscribe(callback);
    });

    it('should get the page`s title', () => {
      expect(pageMetaResolver.getTitle).toHaveBeenCalled();
    });

    it('should build a breadcrumb', () => {
      expect(callback).toHaveBeenCalledWith(expect.arrayContaining([{ text }]));
    });
  });
});
