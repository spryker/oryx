import { nextFrame } from '@open-wc/testing-helpers';
import { PageMetaResolver } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { DirectionalityPageMetaResolver } from './directionality-page-meta-resolver';
import { LangPageMetaResolver } from './lang-page-meta-resolver';

const injectMockLocaleService = (lang?: string) => {
  class MockLocaleService implements Partial<LocaleService> {
    get = vi.fn().mockReturnValue(lang ? of(lang) : null);
  }

  createInjector({
    providers: [
      {
        provide: LocaleService,
        useClass: MockLocaleService,
      },
      {
        provide: `${PageMetaResolver}1`,
        useClass: LangPageMetaResolver,
      },
    ],
  });
};

describe('DirectionalityController', () => {
  let service: PageMetaResolver;

  beforeEach(() => {
    injectMockLocaleService('de');
    service = getInjector().inject(`${PageMetaResolver}1`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('should return object with proper lang attribute', async () => {
    const callback = vi.fn();
    service.resolve().subscribe(callback);
    await nextFrame();
    expect(callback).toHaveBeenCalledWith({
      name: 'html',
      attrs: {
        lang: 'de',
      },
    });
  });
});
