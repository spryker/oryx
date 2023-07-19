import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  CollapsibleTextComponent,
  CollapsibleTextToggle,
} from '@spryker-oryx/ui/collapsible-text';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { Product } from '../src/models';
import { ProductService } from '../src/services';
import { ProductDescriptionComponent } from './description.component';
import { productDescriptionComponent } from './description.def';
import { ProductDescriptionOptions } from './description.model.js';

class MockProductService implements Partial<ProductService> {
  get = vi.fn();
}

describe('ProductDescriptionComponent', () => {
  let element: ProductDescriptionComponent;
  let productService: MockProductService;

  beforeAll(async () => {
    await useComponent(productDescriptionComponent);
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

  describe('when a product description is provided', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ sku: '1', description: 'Lorem ipsum.' } as Product)
      );
      element = await fixture(
        html` <oryx-product-description
          sku="1"
          .content="${{ truncateAfter: 100 }}"
        ></oryx-product-description>`
      );
    });

    it('should passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render the description', () => {
      expect(element.renderRoot.textContent?.trim()).toBe('Lorem ipsum.');
    });
  });

  describe('when the product description contains new lines provided', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({
          sku: '1',
          description: `Lorem ipsum dolor\nsit
          amet.`,
        } as Product)
      );
      element = await fixture(
        html` <oryx-product-description
          sku="1"
          .content="${{ truncateAfter: 100 }}"
        ></oryx-product-description>`
      );
    });

    it('should replace the new lines with <br/> elements', () => {
      expect(
        element.shadowRoot?.querySelector('oryx-collapsible-text p')?.innerHTML
      ).toBe('Lorem ipsum dolor<br>sit<br>amet.');
    });
  });

  describe('when options are provided', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({
          sku: '1',
          description: 'Lorem ipsum.',
        } as Product)
      );
      element = await fixture(
        html`<oryx-product-description
          sku="1"
          .options=${{
            enableToggle: true,
            lineClamp: 3,
          } as ProductDescriptionOptions}
          .content="${{ truncateAfter: 100 }}"
        ></oryx-product-description>`
      );
    });

    it('should pass the options to the oryx-text', () => {
      const text = element.shadowRoot?.querySelector(
        'oryx-collapsible-text'
      ) as CollapsibleTextComponent;
      expect(text.toggle).toBe(CollapsibleTextToggle.Icon);
      expect(text.lineClamp).toBe(3);
    });
  });

  describe('when truncateAfter option is not specified', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-description
          .product=${{ description: 'test' }}
        ></oryx-product-description>`
      );
    });

    it('should default to 3', () => {
      const text = element.shadowRoot?.querySelector(
        'oryx-collapsible-text'
      ) as CollapsibleTextComponent;
      expect(text.lineClamp).toBe(3);
    });
  });
});
