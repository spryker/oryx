import {
  createInjector,
  destroyInjector,
  getInjector,
} from '@spryker-oryx/injector';
import {
  CurrencyService,
  DefaultCurrencyService,
  DefaultLocaleService,
  LocaleService,
} from '@spryker-oryx/site';
import { Observable } from 'rxjs';
import { DefaultPricingService } from './default-pricing.service';
import { Price, PricingService } from './pricing.service';

const mockEur: Price = {
  currency: 'EUR',
  value: 1095,
};

const mockUSD: Price = {
  currency: 'USD',
  value: 1195,
};

describe('DefaultPricingService', () => {
  let service: PricingService;
  let testInjector;

  let mockLocaleService: LocaleService;
  let mockCurrencyService: CurrencyService;

  beforeEach(() => {
    testInjector = createInjector({
      providers: [
        {
          provide: LocaleService,
          useClass: DefaultLocaleService,
        },
        {
          provide: CurrencyService,
          useClass: DefaultCurrencyService,
        },
        {
          provide: PricingService,
          useClass: DefaultPricingService,
        },
      ],
    });

    mockLocaleService = getInjector().inject(LocaleService);
    mockCurrencyService = getInjector().inject(CurrencyService);

    service = testInjector.inject(
      PricingService
    ) as unknown as DefaultPricingService;
  });

  afterEach(() => {
    destroyInjector();
  });

  const expectFormattedPrice = (
    locale: string,
    value: number,
    formatted: string
  ): void => {
    describe(`when the locale is ${locale}`, () => {
      beforeEach(async () => {
        mockLocaleService.set(locale);
      });
      it(`should return a formatted price: (${formatted})`, () => {
        const cb = vi.fn();
        service.format(value).subscribe(cb);
        expect(cb).toHaveBeenCalledWith(formatted);
      });
    });
  };

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultPricingService);
  });

  describe('format', () => {
    beforeEach(async () => {
      mockLocaleService.set('de-DE');
      mockCurrencyService.set('EUR');
    });

    it('should return an observable', () => {
      expect(service.format(0)).toBeInstanceOf(Observable);
    });

    it('should return empty string when price is not provided', () => {
      const cb = vi.fn();
      service.format().subscribe(cb);
      expect(cb).toHaveBeenCalledWith('');
    });

    it('should accept strings and return formatted value', () => {
      const cb = vi.fn();
      service.format(1095).subscribe(cb);
      expect(cb).toHaveBeenCalledWith('10,95 €');
    });

    it('should throw error when value is invalid', () => {
      const value = 'test';
      const cb = vi.fn();
      service.format(value).subscribe({
        error: cb,
      });
      expect(cb).toHaveBeenCalledWith(
        Error(`Price error: ${value} is invalid value`)
      );
    });

    describe('with different locales', () => {
      expectFormattedPrice('de-DE', 1095, '10,95 €');
      expectFormattedPrice('nl-NL', 1095, '€ 10,95');
      expectFormattedPrice('en-EN', 1095, '€10.95');
    });

    describe('with pricing object', () => {
      describe('and price currency is valid', () => {
        it('should format the price', () => {
          const cb = vi.fn();
          service.format(mockEur).subscribe(cb);
          expect(cb).toHaveBeenCalledWith('10,95 €');
        });
      });

      describe('and price currency is invalid', () => {
        it('should throw currency error', () => {
          const cb = vi.fn();
          service.format(mockUSD).subscribe({
            error: cb,
          });
          expect(cb).toHaveBeenCalledWith(
            Error(`Price error: ${mockUSD.currency} is invalid currency`)
          );
        });
      });
    });
  });
});
