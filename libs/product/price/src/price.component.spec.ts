import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService } from '@spryker-oryx/experience';
import {
  createInjector,
  destroyInjector,
  getInjector,
} from '@spryker-oryx/injector';
import { ProductService } from '@spryker-oryx/product';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { LocaleService, siteProviders } from '@spryker-oryx/site';
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

describe('ProductPriceComponent', () => {
  let element: ProductPriceComponent;
  let mockLocaleService: LocaleService;
  let mockProductService: ProductService;

  beforeAll(async () => {
    await useComponent(productPriceComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        ...siteProviders,
        ...mockProductProviders,
        {
          provide: ExperienceService,
          useClass: MockExperienceService,
        },
      ],
    });

    mockLocaleService = getInjector().inject(LocaleService);
    mockProductService = getInjector().inject(ProductService);
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
    beforeEach(async () => {
      mockLocaleService.set('en-EN');
    });

    describe('and default price is provided', () => {
      beforeEach(async () => {
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
    beforeEach(() => {
      mockLocaleService.set('en-EN');
    });

    describe('when there is no original price available', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementationOnce(() =>
          of({ price: { defaultPrice: mockEur } })
        );

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
