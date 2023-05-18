import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { html } from 'lit';
import { of } from 'rxjs';
import { siteProviders } from '../../services';
import { DateComponent } from './date.component';
import { dateComponent } from './date.def';

class MockLocaleService implements Partial<LocaleService> {
  get = vi.fn().mockReturnValue(of('en'));
  formatDate = vi.fn();
}

describe('DateComponent', () => {
  let element: DateComponent;
  let localeService: MockLocaleService;

  beforeAll(async () => {
    await useComponent([dateComponent]);
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
      element = await fixture(html`<oryx-date></oryx-date>`);
    });

    it('should be an instance of DateComponent', () => {
      expect(element).toBeInstanceOf(DateComponent);
    });
  });

  describe('when the current locale is "en"', () => {
    beforeEach(async () => {
      localeService.get.mockReturnValue(of('en'));
    });

    describe('and the stamp is 2023-04-26', () => {
      beforeEach(async () => {
        localeService.formatDate.mockReturnValue('formatted-date');
        element = await fixture(
          html`<oryx-date .stamp=${new Date('2023-04-26')}></oryx-date>`
        );
      });

      it('should call the locale service to format the date', () => {
        expect(localeService.formatDate).toHaveBeenCalledWith(
          new Date('2023-04-26')
        );
      });

      it('should render the formatted date', () => {
        expect(element.shadowRoot?.textContent?.trim()).toBe('formatted-date');
      });
    });
  });

  describe('when an i18n token is provided', () => {
    beforeEach(async () => {
      localeService.get.mockReturnValue(of('en'));
      localeService.formatDate.mockReturnValue('formatted-date');
    });

    describe('and there is a date available', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-date
            .stamp=${new Date('2023-04-26')}
            i18nToken="my.custom-<date>-date"
          ></oryx-date>`
        );
      });

      it('should render the token', () => {
        expect(element.shadowRoot?.textContent?.trim()).toBe(
          'Custom formatted-date date'
        );
      });
    });

    describe('and there is no date available', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-date
            .stamp=${null}
            i18nToken="my.custom-<date>-date"
          ></oryx-date>`
        );
      });

      it('should not render the token', () => {
        expect(element.shadowRoot?.textContent?.trim()).toBe('');
      });
    });
  });
});
