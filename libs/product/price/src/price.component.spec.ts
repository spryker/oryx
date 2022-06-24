import { fixture, fixtureCleanup } from '@open-wc/testing-helpers';
import { ExperienceService } from '@spryker-oryx/experience';
import {
  createInjector,
  destroyInjector,
  getInjector,
} from '@spryker-oryx/injector';
import {
  CurrencyService,
  LocaleService,
  ProductPrice,
  ProductService,
} from '@spryker-oryx/product';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { MOCK_PRODUCT_PROVIDERS } from '../../src/mocks';
import '../index';
import { ProductPriceComponent } from './price.component';

class MockExperienceService {
  getContent(): Observable<any> {
    return of({ data: {} });
  }
}

const mockEur = {
  currency: 'EUR',
  value: 1095,
  isNet: true,
};

const mockUSD = {
  currency: 'USD',
  value: 1195,
  isNet: true,
};

describe('ProductPriceComponent', () => {
  let element: ProductPriceComponent;

  let mockLocaleService: LocaleService;
  let mockCurrencyService: CurrencyService;
  let mockProductService: ProductService;

  beforeEach(async () => {
    createInjector({
      providers: [
        ...MOCK_PRODUCT_PROVIDERS,
        {
          provide: ExperienceService,
          useClass: MockExperienceService,
        },
      ],
    });
  });

  beforeEach(async () => {
    mockLocaleService = getInjector().inject(LocaleService);
    mockCurrencyService = getInjector().inject(CurrencyService);
    mockProductService = getInjector().inject(ProductService);
  });

  afterEach(() => {
    destroyInjector();
    fixtureCleanup();
  });

  it('is defined', async () => {
    element = await fixture(html`<product-price uid="abc"></product-price>`);
    expect(element).toBeInstanceOf(ProductPriceComponent);
  });

  it('passes the a11y audit', async () => {
    element = await fixture(html`<product-price uid="abc"></product-price>`);
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('format price', () => {
    const expectFormattedPrice = (locale: string, formatted: string): void => {
      describe(`when the locale is ${locale}`, () => {
        beforeEach(async () => {
          mockLocaleService.set(locale);
          element = await fixture(
            html`<product-price uid="abc"></product-price>`
          );
        });
        it(`should have a formatted price (${formatted})`, () => {
          expect(element.shadowRoot?.textContent?.includes(formatted)).toBe(
            true
          );
        });
      });
    };

    describe('when the active currency is EUR', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementationOnce(() =>
          of({ price: { defaultPrice: mockEur } })
        );
      });
      expectFormattedPrice('de-DE', '10,95 €');
      expectFormattedPrice('nl-NL', '€ 10,95');
      expectFormattedPrice('en-EN', '€10.95');

      describe('and there is no price available', () => {
        it('should not render a price');
      });
    });

    describe('when the active currency is USD', () => {
      beforeEach(async () => {
        mockCurrencyService.set('USD');
        vi.spyOn(mockProductService, 'get').mockImplementationOnce(() =>
          of({ price: { defaultPrice: mockUSD } })
        );
      });
      expectFormattedPrice('de-DE', '11,95 $');
      expectFormattedPrice('nl-NL', '$ 11,95');
    });
  });

  describe('original price', () => {
    beforeEach(() => {
      mockLocaleService.set('en-EN');
    });

    describe('when there is no original price available', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementationOnce(() =>
          of({ price: { defaultPrice: mockEur } })
        );
      });
      describe('and the experience is configured to show original price', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-price
              .content=${{ showOriginal: true }}
            ></product-price>`
          );
        });
        it('should not render the original price', () => {
          expect(element.shadowRoot?.querySelector('.original')).toBeNull();
        });
      });
    });

    describe('when there is an original price available', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementationOnce(() =>
          of({
            price: {
              defaultPrice: mockEur,
              originalPrice: mockEur,
            } as ProductPrice,
          })
        );
      });

      describe('and the experience is configured to show original price', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-price
              .content=${{ showOriginal: true }}
            ></product-price>`
          );
        });
        it('should render the original price', () => {
          expect(
            element.shadowRoot
              ?.querySelector('.original')
              ?.textContent?.includes('€10.95')
          ).toBe(true);
        });
      });

      describe('and the experience is configured to not show original price', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-price
              .content=${{ showOriginal: false }}
            ></product-price>`
          );
        });
        it('should not render the original price', () => {
          expect(element.shadowRoot?.querySelector('.original')).toBeNull();
        });
      });

      describe('and the experience is not configured', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-price
              .content=${{ showOriginal: false }}
            ></product-price>`
          );
        });
        it('should not render the original price', () => {
          expect(element.shadowRoot?.querySelector('.original')).toBeNull();
        });
      });
    });
  });
});
