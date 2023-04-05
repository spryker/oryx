import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { html } from 'lit';
import { ProductAttributesComponent } from './attributes.component';
import { productAttributesComponent } from './attributes.def';

describe('Product attributes', () => {
  let element: ProductAttributesComponent;

  beforeAll(async () => {
    await useComponent(productAttributesComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: mockProductProviders,
    });
    element = await fixture(html`
      <oryx-product-attributes
        sku="1"
        .options=${{ columnCount: 3 }}
      ></oryx-product-attributes>
    `);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be defined', () => {
    expect(element).toBeInstanceOf(ProductAttributesComponent);
  });

  it('should have colum count style defined', () => {
    expect(
      element.shadowRoot
        ?.querySelector('dl')
        ?.style.getPropertyValue('--column-count')
    ).toBe('3');
  });

  it('should render attributes', () => {
    it('should render attribute terms', () => {
      expect(element).not.toContainElement('dt:nth-child(2)');
    });

    it('should render attribute values', () => {
      expect(element).not.toContainElement('dd:nth-child(2)');
    });
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when no attributes available in product', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-attributes
          sku="6"
          columnCount="3"
        ></oryx-product-attributes>
      `);
    });

    it('should not render any attributes', () => {
      expect(element).not.toContainElement('dt');
    });
  });

  describe('when bad sku provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-attributes></oryx-product-attributes>
      `);
    });

    it('should not render any attributes', () => {
      expect(element).not.toContainElement('dt');
    });
  });
});
