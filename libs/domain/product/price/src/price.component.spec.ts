import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { ProductPrice, ProductService } from '@spryker-oryx/product';
import { PricingService } from '@spryker-oryx/site';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { ProductPriceComponent } from './price.component';
import { productPriceComponent } from './price.def';

class MockExperienceService implements Partial<ExperienceService> {
  getOptions(): Observable<any> {
    return of({ data: {} });
  }
}

const mockEurNet = {
  currency: 'EUR',
  value: 1095,
  isNet: true,
};

const mockEurGross = {
  currency: 'EUR',
  value: 1095,
  isNet: false,
};

class MockPricingService implements Partial<PricingService> {
  format(price: ProductPrice) {
    if (!price) return of(null);
    return of(`${price.currency} ${price.value}`);
  }
}

class MockProductService implements Partial<ProductService> {
  get = vi.fn();
}

describe('ProductPriceComponent', () => {
  let element: ProductPriceComponent;
  let mockProductService: ProductService;

  beforeAll(async () => {
    await useComponent(productPriceComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: PricingService,
          useClass: MockPricingService,
        },
        {
          provide: ExperienceService,
          useClass: MockExperienceService,
        },
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
        {
          provide: ProductService,
          useClass: MockProductService,
        },
      ],
    });

    mockProductService = getInjector().inject(ProductService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when the component is created', () => {
    it('is defined', async () => {
      element = await fixture(
        html`<oryx-product-price sku="123"></oryx-product-price>`
      );
      expect(element).toBeInstanceOf(ProductPriceComponent);
    });

    it('passes the a11y audit', async () => {
      element = await fixture(
        html`<oryx-product-price sku="123"></oryx-product-price>`
      );
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when no price is provided', () => {
    describe('and no sales price is provided', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementation(() => of());
        element = await fixture(
          html`<oryx-product-price sku="123"></oryx-product-price>`
        );
      });

      it(`should not render any price`, () => {
        expect(element).not.toContainElement('oryx-site-price');
      });
    });

    describe('and a sales price is provided', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementation(() => of());
        element = await fixture(
          html`<oryx-product-price
            sku="123"
            .sales=${1234}
          ></oryx-product-price>`
        );
      });

      it(`should render a sales price`, () => {
        expect(
          element.renderRoot.querySelector('oryx-site-price[part="sales"]')
        ).toHaveProperty('value', 1234);
      });
    });
  });

  describe('when only a default price is provided', () => {
    describe('and there is no currency property provided', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementation(() =>
          of({ price: { defaultPrice: mockEurNet } })
        );
        element = await fixture(
          html`<oryx-product-price sku="123"></oryx-product-price>`
        );
      });

      it(`should render the sales price`, () => {
        expect(
          element.renderRoot.querySelector('oryx-site-price[part="sales"]')
        ).toHaveProperty('value', 1095);
      });

      it(`should render the tax`, () => {
        expect(element).toContainElement('span[part="tax"]');
      });
    });

    describe('and the currency property is different from the price currency', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementation(() =>
          of({ price: { defaultPrice: mockEurNet } })
        );
        element = await fixture(
          html`<oryx-product-price
            sku="123"
            currency="USD"
          ></oryx-product-price>`
        );
      });

      it(`should not render the sales price`, () => {
        expect(element).not.toContainElement('oryx-site-price[part="sales"]');
      });

      it(`should not render the tax`, () => {
        expect(element).not.toContainElement('span[part="tax"]');
      });
    });
  });

  describe('when only an original price is provided', () => {
    describe('and there is no currency property provided', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementation(() =>
          of({ price: { originalPrice: mockEurNet } })
        );
        element = await fixture(
          html`<oryx-product-price sku="123"></oryx-product-price>`
        );
      });

      it(`should render the original price`, () => {
        expect(element).toContainElement('oryx-site-price[part="sales"]');
      });

      it(`should render the tax`, () => {
        expect(element).toContainElement('[part="tax"]');
      });
    });

    describe('and the currency property is different from the price currency', () => {
      beforeEach(async () => {
        vi.spyOn(mockProductService, 'get').mockImplementation(() =>
          of({ price: { originalPrice: mockEurNet } })
        );
        element = await fixture(
          html`<oryx-product-price
            sku="123"
            currency="USD"
          ></oryx-product-price>`
        );
      });

      it(`should not render the original price`, () => {
        expect(element).not.toContainElement('oryx-site-price[part="sales"]');
      });

      it(`should not render the tax`, () => {
        expect(element).not.toContainElement('[part="tax"]');
      });
    });
  });

  describe('when a default and original price is provided', () => {
    beforeEach(async () => {
      vi.spyOn(mockProductService, 'get').mockImplementation(() =>
        of({ price: { originalPrice: mockEurNet, defaultPrice: mockEurNet } })
      );
      element = await fixture(
        html`<oryx-product-price sku="123"></oryx-product-price>`
      );
    });

    it(`should render the sales price`, () => {
      expect(element).toContainElement('[part="sales"]');
    });

    it(`should render the tax`, () => {
      expect(element).toContainElement('[part="tax"]');
    });

    it(`should render the original price`, () => {
      expect(element).toContainElement('[part="original"]');
    });
  });

  describe('when the price is net', () => {
    beforeEach(async () => {
      vi.spyOn(mockProductService, 'get').mockImplementation(() =>
        of({ price: { originalPrice: mockEurNet, defaultPrice: mockEurNet } })
      );
      element = await fixture(
        html`<oryx-product-price sku="123"></oryx-product-price>`
      );
    });

    it(`should render the tax excluded message`, () => {
      const vat = element.shadowRoot?.querySelector('[part="tax"]');
      expect(vat?.textContent).toContain('Tax excluded');
    });
  });

  describe('when the price is gross', () => {
    beforeEach(async () => {
      vi.spyOn(mockProductService, 'get').mockImplementation(() =>
        of({
          price: { originalPrice: mockEurGross, defaultPrice: mockEurGross },
        })
      );
      element = await fixture(
        html`<oryx-product-price sku="123"></oryx-product-price>`
      );
    });

    it(`should render the tax included message`, () => {
      const vat = element.shadowRoot?.querySelector('[part="tax"]');
      expect(vat?.textContent).toContain('Tax included');
    });
  });

  describe('enableSalesLabel', () => {
    describe('when the enableSalesLabel is true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-price
            sku="1"
            .options=${{ enableSalesLabel: true }}
          ></oryx-product-price>`
        );
      });

      it('should render the oryx-product-labels', () => {
        expect(element).toContainElement('oryx-product-labels');
      });
    });

    describe('when enableSalesLabel is not provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-price
            sku="1"
            .options=${{ enableSalesLabel: false }}
          ></oryx-product-price>`
        );
      });

      it('should render the oryx-product-labels', () => {
        expect(element).not.toContainElement('oryx-product-labels');
      });
    });

    describe('when enableSalesLabel is false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-price
            sku="1"
            .options=${{ enableSalesLabel: false }}
          ></oryx-product-price>`
        );
      });

      it('should render the oryx-product-labels', () => {
        expect(element).not.toContainElement('oryx-product-labels');
      });
    });
  });
});
