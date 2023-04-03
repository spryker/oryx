import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { TextComponent } from '@spryker-oryx/ui/text';
import { html } from 'lit';
import { ProductDescriptionComponent } from './description.component';
import { productDescriptionComponent } from './description.def';
import { ProductDescriptionOptions } from './description.model';

describe('ProductDescriptionComponent', () => {
  let element: ProductDescriptionComponent;

  const getText = (): TextComponent => {
    return element.shadowRoot?.querySelector('oryx-text') as TextComponent;
  };

  beforeAll(async () => {
    await useComponent(productDescriptionComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: mockProductProviders,
    });
    element = await fixture(
      html` <oryx-product-description
        sku="1"
        uid="1"
        .content="${{ truncateAfter: 100 }}"
      ></oryx-product-description>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when the component is rendered', () => {
    const options: ProductDescriptionOptions = {
      truncateAfter: 3,
      expandInitially: false,
      enableToggle: true,
    };

    beforeEach(async () => {
      element = await fixture(
        html` <oryx-product-description
          sku="6"
          .options=${options}
        ></oryx-product-description>`
      );
    });

    it('should slot the product description into the oryx-text component', () => {
      expect(element.shadowRoot?.querySelector('oryx-text p')?.innerHTML).toBe(
        'Lorem ipsum dolor<br>sit amet.'
      );
    });

    it('should pass the options to the oryx-text', () => {
      expect(
        Number(getComputedStyle(getText()).getPropertyValue('--line-clamp'))
      ).toBe(options.truncateAfter);
      expect(getText().hideToggle).toBe(!options.enableToggle);
      expect(getText().defaultExpanded).toBe(options.expandInitially);
    });
  });

  describe('when truncateAfter option is not specified', () => {
    beforeEach(async () => {
      element = await fixture(
        html` <oryx-product-description
          .product=${{ description: 'test' }}
        ></oryx-product-description>`
      );
    });

    it('should set the default value', () => {
      expect(getComputedStyle(getText()).getPropertyValue('--line-clamp')).toBe(
        '3'
      );
    });
  });
});
