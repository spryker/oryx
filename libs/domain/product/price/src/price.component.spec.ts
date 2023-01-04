import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { ProductService } from '@spryker-oryx/product';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { PricingService } from '@spryker-oryx/site';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { productPriceComponent } from './component';
import { ProductPriceComponent } from './price.component';

class MockExperienceService implements Partial<ExperienceService> {
  getOptions(): Observable<any> {
    return of({ data: {} });
  }
}

const mockEur = {
  currency: 'EUR',
  value: 1095,
  isNet: true,
};

class MockPricingService implements Partial<PricingService> {
  format = vi.fn();
}

describe('ProductPriceComponent', () => {
  let element: ProductPriceComponent;
  let mockProductService: ProductService;
  let mockPricingService: MockPricingService;

  beforeAll(async () => {
    await useComponent(productPriceComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        ...mockProductProviders,
        {
          provide: PricingService,
          useClass: MockPricingService,
        },
        {
          provide: ExperienceService,
          useClass: MockExperienceService,
        },
      ],
    });

    mockProductService = getInjector().inject(ProductService);
    mockPricingService = getInjector().inject(
      PricingService
    ) as MockPricingService;

    mockPricingService.format.mockReturnValue(of('mock'));
  });

  afterEach(() => {
    destroyInjector();
  });

  it('is defined', async () => {
    element = await fixture(html`<product-price sku="123"></product-price>`);
    expect(element).toBeInstanceOf(ProductPriceComponent);
  });

  it('passes the a11y audit', async () => {
    element = await fixture(html`<product-price sku="123"></product-price>`);
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('default price', () => {
    describe('and default price is provided', () => {
      beforeEach(async () => {
        mockPricingService.format.mockReturnValue(of('€10.95'));
        vi.spyOn(mockProductService, 'get').mockImplementationOnce(() =>
          of({ price: { defaultPrice: mockEur } })
        );
        element = await fixture(
          html`<product-price sku="123"></product-price>`
        );
      });

      it(`should render default price`, () => {
        expect(element.shadowRoot?.textContent?.includes('€10.95')).toBe(true);
      });
    });

    describe('and default price is not provided', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementationOnce(() =>
          of({})
        );
      });

      it(`should not render default price`, () => {
        expect(element.shadowRoot?.textContent?.trim()).toContain('');
      });
    });
  });

  describe('original price', () => {
    describe('when there is no original price available', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementationOnce(() =>
          of({ price: { defaultPrice: mockEur } })
        );
        mockPricingService.format.mockReturnValue(of(null));

        element = await fixture(
          html`<product-price sku="123"></product-price>`
        );
      });

      it(`should render default-original part`, () => {
        expect(element).toContainElement('[part*="default-original"]');
      });

      it('should not render the original', () => {
        expect(element).not.toContainElement('[part="original"]');
      });
    });

    describe('when there is an original price available', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementationOnce(() =>
          of({
            price: {
              defaultPrice: mockEur,
              originalPrice: mockEur,
            },
          })
        );

        element = await fixture(
          html`<product-price sku="123"></product-price>`
        );
      });

      it(`should not render default-original part`, () => {
        expect(element).not.toContainElement('[part*="default-original"]');
      });

      it('should render the parts', () => {
        expect(element).toContainElement('[part="default"]');
        expect(element).toContainElement('[part="original"]');
      });

      describe('and the experience is configured to hide original price', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-price
              sku="123"
              .options=${{ hideOriginal: true }}
            ></product-price>`
          );
        });
        it('should not render the original', () => {
          expect(element).not.toContainElement('[part="original"]');
        });
      });
    });
  });
});
