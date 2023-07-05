import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { Currency, CurrencyService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { SiteCurrencySelectorComponent } from './currency-selector.component';
import { siteCurrencySelectorComponent } from './currency-selector.def';

class MockCurrencyService implements Partial<CurrencyService> {
  get = vi.fn().mockReturnValue('EUR');
  getAll = vi.fn().mockReturnValue([]);
  set = vi.fn();
}

class MockLocaleService implements Partial<LocaleService> {
  get = vi.fn().mockReturnValue(of('en'));
}

describe('SiteCurrencySelectorComponent', () => {
  let element: SiteCurrencySelectorComponent;
  let currencyService: MockCurrencyService;
  let localeService: MockLocaleService;

  beforeAll(async () => {
    await useComponent([siteCurrencySelectorComponent]);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: CurrencyService,
          useClass: MockCurrencyService,
        },
        {
          provide: LocaleService,
          useClass: MockLocaleService,
        },
      ],
    });
    currencyService = injector.inject(
      CurrencyService
    ) as unknown as MockCurrencyService;

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
      element = await fixture(
        html`<oryx-site-currency-selector></oryx-site-currency-selector>`
      );
    });
    it('is defined', () => {
      expect(element).toBeInstanceOf(SiteCurrencySelectorComponent);
    });
  });

  describe('when there are no currencies', () => {
    beforeEach(async () => {
      currencyService.getAll.mockReturnValue(of([]));
      element = await fixture(
        html`<oryx-site-currency-selector></oryx-site-currency-selector>`
      );
    });

    it('should not render the currency selector', () => {
      expect(element).not.toContainElement('button');
    });
  });

  describe('when there is only one currency', () => {
    beforeEach(async () => {
      currencyService.getAll.mockReturnValue(of([{ code: 'EUR' } as Currency]));
      element = await fixture(
        html`<oryx-site-currency-selector></oryx-site-currency-selector>`
      );
    });

    it('should not show the currency selector', () => {
      expect(element).not.toContainElement('button');
    });
  });

  describe('when there are more than one currencies', () => {
    beforeEach(async () => {
      currencyService.getAll.mockReturnValue(
        of([{ code: 'EUR' }, { code: 'USD' }, { code: 'GBP' }] as Currency[])
      );
      element = await fixture(
        html`<oryx-site-currency-selector></oryx-site-currency-selector>`
      );
    });

    it('should show the currency selector', () => {
      expect(element).toContainElement('button');
    });

    describe('and a currency is selected', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-site-currency-selector></oryx-site-currency-selector>`
        );
        const usdOption = element.shadowRoot?.querySelector(
          'oryx-option[value=USD]'
        );
        usdOption?.dispatchEvent(new Event('click'));
      });

      it('should change set the currency', () => {
        expect(currencyService.set).toHaveBeenCalledWith('USD');
      });
    });

    describe('and the language is Spanish', () => {
      beforeEach(async () => {
        localeService.get.mockReturnValue(of('es'));
        element = await fixture(
          html`<oryx-site-currency-selector></oryx-site-currency-selector>`
        );
      });

      it('should render the currency selector', () => {
        const button = element.shadowRoot?.querySelector('button');
        expect(button).toBeDefined();
        expect(button?.textContent).toContain('EUR');
      });

      it('should render the EUR option', () => {
        const eur = element.shadowRoot?.querySelector('oryx-option[value=EUR]');
        expect(eur).toBeDefined();
        expect(eur?.textContent).toContain('euro');
      });

      it('should render the USD option', () => {
        const eur = element.shadowRoot?.querySelector('oryx-option[value=USD]');
        expect(eur).toBeDefined();
        expect(eur?.textContent).toContain('dólar estadounidense');
      });

      it('should render the GBP option', () => {
        const eur = element.shadowRoot?.querySelector('oryx-option[value=GBP]');
        expect(eur).toBeDefined();
        expect(eur?.textContent).toContain('libra esterlina');
      });
    });
  });
});
