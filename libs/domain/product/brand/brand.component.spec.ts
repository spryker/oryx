import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { imageComponent } from '@spryker-oryx/ui';
import { ImageComponent } from '@spryker-oryx/ui/image';
import { html } from 'lit';
import { ProductBrandComponent } from './brand.component';
import { productBrandComponent } from './brand.def';

describe('ProductBrandComponent', () => {
  let element: ProductBrandComponent;

  beforeAll(async () => {
    await useComponent([productBrandComponent, imageComponent]);
  });

  beforeEach(async () => {
    createInjector({
      providers: mockProductProviders,
    });
    element = await fixture(html`
      <oryx-product-brand sku="1"></oryx-product-brand>
    `);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be defined', () => {
    expect(element).toBeInstanceOf(ProductBrandComponent);
  });
  describe('when brand attribute available in product', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-brand sku="1"></oryx-product-brand>
      `);
    });

    it('should not render the brand image', () => {
      const image = element.shadowRoot?.querySelector(
        'oryx-image'
      ) as ImageComponent;
      expect(image.resource).toBe('brand1');
    });
  });

  describe('when no attributes available in product', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-brand sku="6"></oryx-product-brand>
      `);
    });

    it('should not render the brand image', () => {
      expect(element).not.toContainElement('oryx-image');
    });
  });

  describe('when no attributes available in product', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-brand sku="6"></oryx-product-brand>
      `);
    });

    it('should not render the brand image', () => {
      expect(element).not.toContainElement('oryx-image');
    });
  });

  describe('when no SKU provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-brand></oryx-product-brand>
      `);
    });

    it('should not render the brand image', () => {
      expect(element).not.toContainElement('oryx-image');
    });
  });
});
