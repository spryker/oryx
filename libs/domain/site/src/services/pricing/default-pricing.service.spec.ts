import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { CurrencyService, LocaleService } from '@spryker-oryx/site';
import { Observable, of } from 'rxjs';
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

class MockLocaleService implements Partial<LocaleService> {
  get = vi.fn();
}

class MockCurrencyService implements Partial<CurrencyService> {
  get = vi.fn().mockReturnValue(of('EUR'));
}

describe('DefaultPricingService', () => {
  let service: PricingService;
  let localeService: MockLocaleService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: LocaleService,
          useClass: MockLocaleService,
        },
        {
          provide: CurrencyService,
          useClass: MockCurrencyService,
        },
        {
          provide: PricingService,
          useClass: DefaultPricingService,
        },
      ],
    });

    localeService = testInjector.inject(
      LocaleService
    ) as unknown as MockLocaleService;
    service = testInjector.inject(PricingService);

    localeService.get.mockReturnValue(of('de-DE'));
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
        localeService.get.mockReturnValue(of(locale));
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
    it('should return an observable', () => {
      expect(service.format(0)).toBeInstanceOf(Observable);
    });

    it('should return null when price is not provided', () => {
      const cb = vi.fn();
      service.format().subscribe(cb);
      expect(cb).toHaveBeenCalledWith(null);
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
        it('should return null', () => {
          const cb = vi.fn();
          service.format(mockUSD).subscribe(cb);
          expect(cb).toHaveBeenCalledWith(null);
        });
      });
    });
  });
});
