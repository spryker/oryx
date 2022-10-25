import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import {
  mockProductProviders,
  MockProductService,
} from '@spryker-oryx/product/mocks';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { ProductTitleComponent } from './title.component';
import { productTitleComponent } from './title.def';

const mockSku = '1';

class MockExperienceContentService implements Partial<ExperienceService> {
  getOptions = ({ uid = '' }): Observable<any> => of({});
}

// TODO: unify unit tests for all sub packages
describe('ProductTitleComponent', () => {
  let element: ProductTitleComponent;

  beforeAll(async () => {
    await useComponent(productTitleComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        ...mockProductProviders,
        {
          provide: ExperienceService,
          useClass: MockExperienceContentService,
        },
      ],
    });
    element = await fixture(
      html`<product-title
        sku="${mockSku}"
        .options=${{ tag: 'h1' }}
      ></product-title>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  const expectContentInTag = (tag: string): void => {
    describe(`<${tag}> tag`, () => {
      beforeEach(async () => {
        element = await fixture(
          html`<product-title
            sku="${mockSku}"
            .options=${{ tag }}
          ></product-title>`
        );
      });
      it(`should render the product title in the tag`, () => {
        const heading = element?.shadowRoot?.querySelector(tag);
        const product = MockProductService.mockProducts.find(
          (data) => data.sku === mockSku
        );
        expect(heading?.textContent).toContain(product?.name);
      });
    });
  };

  describe('link to pdp', () => {
    describe('when the link is set to true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<product-title
            sku="${mockSku}"
            .options=${{ link: true }}
          ></product-title>`
        );
      });

      it('should wrap the element inside a link', () => {
        expect(element).toContainElement('content-link');
      });
    });

    describe('when the link is not set', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<product-title sku="${mockSku}" .options=${{}}></product-title>`
        );
      });
      it('should not wrap the element inside a link', () => {
        expect(element).not.toContainElement('content-link');
      });
    });
  });

  describe('tags', () => {
    expectContentInTag('h1');
    expectContentInTag('h2');
    expectContentInTag('h3');
    expectContentInTag('h4');
    expectContentInTag('h5');
    expectContentInTag('h6');

    describe('when tag option is not specified', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<product-title sku="${mockSku}"></product-title>`
        );
      });
      it(`should not wrap the oryx-text to the header element`, () => {
        const textElement = element.renderRoot.querySelector('oryx-text');
        expect(textElement?.parentElement).toBe(null);
      });
    });
  });
});
