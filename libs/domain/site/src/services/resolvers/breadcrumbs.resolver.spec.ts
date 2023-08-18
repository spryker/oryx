import { PageMetaResolverService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  DefaultBreadcrumbs,
  DefaultBreadcrumbsResolver,
} from '@spryker-oryx/site';
import { of } from 'rxjs';

const text = 'test';

class MockPageMetaResolverService implements Partial<PageMetaResolverService> {
  getTitle = vi.fn().mockReturnValue(of(text));
}

describe('DefaultBreadcrumbsResolver', () => {
  let service: DefaultBreadcrumbsResolver;
  let pageMetaResolver: MockPageMetaResolverService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        DefaultBreadcrumbs,
        {
          provide: PageMetaResolverService,
          useClass: MockPageMetaResolverService,
        },
      ],
    });

    pageMetaResolver = testInjector.inject<MockPageMetaResolverService>(
      PageMetaResolverService
    );
    service = testInjector.inject(DefaultBreadcrumbs.provide);
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
