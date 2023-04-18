import { nextFrame } from '@open-wc/testing-helpers';
import { PageMetaService } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import {
  LocaleMetaAppInitializer,
  LocaleMetaInitializer,
  LocaleService,
} from '@spryker-oryx/i18n';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';

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
        provide: LocaleMetaAppInitializer,
        useClass: LocaleMetaInitializer,
      },
      {
        provide: PageMetaService,
        useValue: mockMeta,
      },
    ],
  });
};

describe('DirectionalityController', () => {
  let service: LocaleMetaInitializer;

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when locale has language with LTR direction', () => {
    beforeEach(() => {
      injectMockLocaleService('de');
      service = getInjector().inject(LocaleMetaAppInitializer);
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
      service = getInjector().inject(LocaleMetaAppInitializer);
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
      service = getInjector().inject(LocaleMetaAppInitializer);
    });

    it('should not call PageMetaService.setHtmlAttributes', async () => {
      service.initialize().subscribe();
      await nextFrame();
      expect(mockMeta.setHtmlAttributes).not.toHaveBeenCalled();
    });
  });
});
