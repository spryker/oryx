import '@/tools/testing';
import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { Product } from '../../src/models';
import { ProductService } from '../../src/services';
import { ProductLabelsComponent } from './label.component';
import { productLabelsComponent } from './label.def';

class MockProductService implements Partial<ProductService> {
  get = vi.fn();
}

describe('ProductLabelsComponent', () => {
  let element: ProductLabelsComponent;
  let productService: MockProductService;

  beforeAll(async () => {
    await useComponent(productLabelsComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
      ],
    });

    productService = injector.inject<MockProductService>(ProductService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when the product has no labels', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(of({ sku: '1' }));
      element = await fixture(
        html`<oryx-product-labels sku="3"></oryx-product-labels>`
      );
    });

    it('should not render chip elements', () => {
      expect(element).not.toContainElement('oryx-chip');
    });
  });

  describe('when the product has two labels', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ sku: '1', labels: [{ name: 'new' }, { name: 'sale' }] } as Product)
      );
      element = await fixture(
        html`<oryx-product-labels sku="1"></oryx-product-labels>`
      );
    });

    it('should render 2 chip elements', () => {
      const chips = element.renderRoot.querySelectorAll('oryx-chip');
      expect(chips.length).toBe(2);
    });

    describe('and NEW labels are excluded', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-labels
            sku="1"
            .options=${{ excluded: 'new' }}
          ></oryx-product-labels>`
        );
      });

      it('should only render the SALE label', () => {
        const chips = element.renderRoot.querySelectorAll('oryx-chip');
        expect(chips.length).toBe(1);
        expect(chips[0].textContent?.trim()).toBe('sale');
      });
    });

    describe('and SALE labels are included', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-labels
            sku="1"
            .options=${{ included: 'SALE' }}
          ></oryx-product-labels>`
        );
      });

      it('should only render the SALE label', () => {
        const chips = element.renderRoot.querySelectorAll('oryx-chip');
        expect(chips.length).toBe(1);
        expect(chips[0].textContent?.trim()).toBe('sale');
      });
    });
  });

  describe('when the product label is inverted', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ sku: '1', labels: [{ name: 'new' }, { name: 'sale' }] } as Product)
      );
      element = await fixture(
        html`<oryx-product-labels
          sku="1"
          .options=${{ invert: true }}
        ></oryx-product-labels>`
      );
    });

    it('should render inverted chip elements', () => {
      expect(element).toContainElement('oryx-chip[invert]');
    });
  });

  describe('when the product label is not inverted', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ sku: '1', labels: [{ name: 'new' }, { name: 'sale' }] } as Product)
      );
      element = await fixture(
        html`<oryx-product-labels
          sku="1"
          .options=${{ invert: false }}
        ></oryx-product-labels>`
      );
    });

    it('should not render inverted chip elements', () => {
      expect(element).toContainElement('oryx-chip:not([invert])');
    });
  });

  describe('when invert is not provided', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ sku: '1', labels: [{ name: 'new' }, { name: 'sale' }] } as Product)
      );
      element = await fixture(
        html`<oryx-product-labels sku="1"></oryx-product-labels>`
      );
    });

    it('should not render inverted chip elements', () => {
      expect(element).toContainElement('oryx-chip:not([invert])');
    });
  });
});
