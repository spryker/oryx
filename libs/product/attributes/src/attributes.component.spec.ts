import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import {
  mockProductProviders,
  MockProductService,
} from '@spryker-oryx/product/mocks';
import { html } from 'lit';
import { ProductAttributesComponent } from './attributes.component';
import { productAttributesComponent } from './component';

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
      <product-attributes
        sku="1"
        .options=${{ columnCount: 3 }}
      ></product-attributes>
    `);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be defined', () => {
    expect(element).toBeInstanceOf(ProductAttributesComponent);
  });

  it('should have colum count style defined', () => {
    const columCount = window
      .getComputedStyle(element)
      .getPropertyValue('--column-count');

    expect(columCount).toBe('3');
  });

  it('should render attributes', () => {
    const attributeKeys = ['brand', 'color'];
    const root = element.shadowRoot!;
    const attributesList = root.querySelectorAll('li');
    const demoAttributesData =
      MockProductService.mockProducts[0]?.attributes || {};
    const demoAttributeNamesData =
      MockProductService.mockProducts[0]?.attributeNames || {};

    expect(attributesList.length).toBeGreaterThan(0);

    attributesList.forEach((attribute, index) => {
      const attributeContentItems = attribute.querySelectorAll('div');
      const attributeKey = attributeKeys[index];

      expect(attributeContentItems.length).toBe(2);
      expect(attributeContentItems[0]?.innerText).toBe(
        demoAttributeNamesData[attributeKey]
      );
      expect(attributeContentItems[1]?.innerText).toBe(
        demoAttributesData[attributeKey]
      );
    });
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when no attributes available in product', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <product-attributes sku="6" columnCount="3"></product-attributes>
      `);
    });

    it('should not render any attributes', () => {
      const attributesList = element.shadowRoot?.querySelectorAll('li');

      expect(attributesList?.length).toBe(0);
    });
  });

  describe('when bad sku provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <product-attributes></product-attributes>
      `);
    });

    it('should not render any attributes', () => {
      const attributesList = element.shadowRoot?.querySelectorAll('li');

      expect(attributesList?.length).toBe(0);
    });
  });
});
