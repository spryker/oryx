import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { siteProviders, siteTimeComponent } from '@spryker-oryx/site';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SiteTimeComponent } from './time.component';

class MockLocaleService implements Partial<LocaleService> {
  get = vi.fn().mockReturnValue(of('en'));
  formatTime = vi.fn();
}

describe('SiteTimeComponent', () => {
  let element: SiteTimeComponent;
  let localeService: MockLocaleService;

  beforeAll(async () => {
    await useComponent([siteTimeComponent]);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        ...siteProviders,
        {
          provide: LocaleService,
          useClass: MockLocaleService,
        },
      ],
    });

    localeService = injector.inject(
      LocaleService
    ) as unknown as MockLocaleService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is initialised', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-site-time></oryx-site-time>`);
    });

    it('should be an instance of SiteDayComponent', () => {
      expect(element).toBeInstanceOf(SiteTimeComponent);
    });
  });

  describe('when the current locale is "en"', () => {
    beforeEach(async () => {
      localeService.get.mockReturnValue(of('en'));
    });

    describe('and the day is monday', () => {
      beforeEach(async () => {
        localeService.formatTime.mockReturnValue('formatted-time');
        element = await fixture(
          html`<oryx-site-time
            .stamp=${'Fri Dec 08 2023 16:57:07'}
          ></oryx-site-time>`
        );
      });

      it('should call the locale service to format the date', () => {
        expect(localeService.formatTime).toHaveBeenCalledWith(
          'Fri Dec 08 2023 16:57:07'
        );
      });

      it('should render the formatted date', () => {
        expect(element.shadowRoot?.textContent?.trim()).toBe('formatted-time');
      });
    });
  });

  describe('when an i18n token is provided', () => {
    beforeEach(async () => {
      localeService.get.mockReturnValue(of('en'));
      localeService.formatTime.mockReturnValue('formatted-time');
    });

    describe('and there is a day available', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-site-time
            .stamp=${'Fri Dec 08 2023 16:57:07'}
            i18nToken="my.custom-<time>-time"
          ></oryx-site-time>`
        );
      });

      it('should render the token', () => {
        expect(element.shadowRoot?.textContent?.trim()).toBe(
          'Custom formatted-time time'
        );
      });
    });

    describe('and there is no day available', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-site-time
            i18nToken="my.custom-<time>-time"
          ></oryx-site-time>`
        );
      });

      it('should not render the token', () => {
        expect(element.shadowRoot?.textContent?.trim()).toBe('');
      });
    });
  });
});
