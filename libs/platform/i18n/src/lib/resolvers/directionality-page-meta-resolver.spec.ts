import { nextFrame } from '@open-wc/testing-helpers';
import { PageMetaResolver } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { DirectionalityPageMetaResolver } from './directionality-page-meta-resolver';

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
        useClass: DirectionalityPageMetaResolver,
      },
    ],
  });
};

describe('DirectionalityController', () => {
  let service: PageMetaResolver;

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when locale has language with LTR direction', () => {
    beforeEach(() => {
      injectMockLocaleService('de');
      service = getInjector().inject(`${PageMetaResolver}1`);
    });

    it('should return object with dir=ltr value', async () => {
      const callback = vi.fn();
      service.resolve().subscribe(callback);
      await nextFrame();
      expect(callback).toHaveBeenCalledWith({
        name: 'html',
        attrs: {
          dir: 'ltr',
        },
      });
    });
  });

  describe('when locale has language with RTL direction', () => {
    beforeEach(async () => {
      injectMockLocaleService('ar');
      service = getInjector().inject(`${PageMetaResolver}1`);
    });

    it('should return object with dir=rtl value', async () => {
      const callback = vi.fn();
      service.resolve().subscribe(callback);
      await nextFrame();
      expect(callback).toHaveBeenCalledWith({
        name: 'html',
        attrs: {
          dir: 'rtl',
        },
      });
    });
  });

  describe('when locale language is not provided', () => {
    beforeEach(async () => {
      injectMockLocaleService();
      service = getInjector().inject(`${PageMetaResolver}1`);
    });

    it('should return empty object', async () => {
      const callback = vi.fn();
      service.resolve().subscribe(callback);
      await nextFrame();
      expect(callback).toHaveBeenCalledWith({});
    });
  });
});
