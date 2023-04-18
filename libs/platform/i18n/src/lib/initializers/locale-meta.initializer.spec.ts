import { nextFrame } from '@open-wc/testing-helpers';
import { PageMetaService } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import {
  DefaultLocaleMetaInitializer,
  LocaleMetaInitializer,
  LocaleService,
} from '@spryker-oryx/i18n';
import { of } from 'rxjs';

const mockMeta = {
  setHtmlAttributes: vi.fn(),
};

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
        provide: LocaleMetaInitializer,
        useClass: DefaultLocaleMetaInitializer,
      },
      {
        provide: PageMetaService,
        useValue: mockMeta,
      },
    ],
  });
};

describe('DefaultLocaleMetaInitializer', () => {
  let service: DefaultLocaleMetaInitializer;

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when locale has language with LTR direction', () => {
    beforeEach(() => {
      injectMockLocaleService('de');
      service = getInjector().inject(LocaleMetaInitializer);
    });

    it('should return object with dir=ltr value', async () => {
      service.initialize().subscribe();
      await nextFrame();
      expect(mockMeta.setHtmlAttributes).toHaveBeenCalledWith({
        dir: 'ltr',
        lang: 'de',
      });
    });
  });

  describe('when locale has language with RTL direction', () => {
    beforeEach(async () => {
      injectMockLocaleService('ar');
      service = getInjector().inject(LocaleMetaInitializer);
    });

    it('should return object with dir=rtl value', async () => {
      service.initialize().subscribe();
      await nextFrame();
      expect(mockMeta.setHtmlAttributes).toHaveBeenCalledWith({
        dir: 'rtl',
        lang: 'ar',
      });
    });
  });

  describe('when locale language is not provided', () => {
    beforeEach(async () => {
      injectMockLocaleService();
      service = getInjector().inject(LocaleMetaInitializer);
    });

    it('should not call PageMetaService.setHtmlAttributes', async () => {
      service.initialize().subscribe();
      await nextFrame();
      expect(mockMeta.setHtmlAttributes).not.toHaveBeenCalled();
    });
  });
});
