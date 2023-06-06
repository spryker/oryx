import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { html } from 'lit';
import { of } from 'rxjs';
import { CurrencyService, siteProviders } from '../../services';
import { PriceComponent } from './price.component';
import { priceComponent } from './price.def';

class MockLocaleService implements Partial<LocaleService> {
  get = vi.fn().mockReturnValue(of('en'));
}

class MockCurrencyService implements Partial<CurrencyService> {
  get = vi.fn().mockReturnValue(of('EUR'));
}

describe('PriceComponent', () => {
  let element: PriceComponent;
  let localeService: MockLocaleService;
  let currencyService: MockCurrencyService;

  beforeAll(async () => {
    await useComponent([priceComponent]);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        ...siteProviders,
        {
          provide: LocaleService,
          useClass: MockLocaleService,
        },
        {
          provide: CurrencyService,
          useClass: MockCurrencyService,
        },
      ],
    });

    localeService = injector.inject(
      LocaleService
    ) as unknown as MockLocaleService;
    currencyService = injector.inject(
      CurrencyService
    ) as unknown as MockCurrencyService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is initialised', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-site-price></oryx-site-price>`);
    });

    it('should be an instance of PriceComponent', () => {
      expect(element).toBeInstanceOf(PriceComponent);
    });
  });

  describe('when the current locale is "en" and the current currency is "EUR"', () => {
    beforeEach(async () => {
      localeService.get.mockReturnValue(of('en'));
      currencyService.get.mockReturnValue(of('EUR'));
    });

    describe('and the value is 1234', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-site-price .value=${1234}></oryx-site-price>`
        );
      });

      it('should render €12.34', () => {
        expect(element.shadowRoot?.textContent?.trim()).toBe('€12.34');
      });
    });

    describe('and when the currency property is set to "USD"', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-site-price
            .value=${1234}
            currency="USD"
          ></oryx-site-price>`
        );
      });

      it('should render $12.34', () => {
        expect(element.shadowRoot?.textContent?.trim()).toBe('$12.34');
      });
    });
  });

  describe('when the current locale is "de" and the current currency is "GBP"', () => {
    beforeEach(async () => {
      localeService.get.mockReturnValue(of('de'));
      currencyService.get.mockReturnValue(of('GBP'));
    });

    describe('and the value is 1234', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-site-price .value=${1234}></oryx-site-price>`
        );
      });

      it('should render 12,34 £', () => {
        expect(element.shadowRoot?.textContent?.trim()).toBe('12,34 £');
      });
    });

    describe('and when the currency property is set to "USD"', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-site-price
            .value=${1234}
            currency="USD"
          ></oryx-site-price>`
        );
      });

      it('should render $12.34', () => {
        expect(element.shadowRoot?.textContent?.trim()).toBe('12,34 $');
      });
    });
  });
});
