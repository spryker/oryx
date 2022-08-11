import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { MockProductService, MOCK_PRODUCT_PROVIDERS } from '../../src/mocks';
import { productTitleComponent } from './index';
import { ProductTitleComponent } from './title.component';

useComponent(productTitleComponent);

const mockSku = '1';

class MockExperienceContentService implements Partial<ExperienceService> {
  getOptions = ({ uid = '' }): Observable<any> => of({});
}

// TODO: unify unit tests for all sub packages
describe('ProductTitleComponent', () => {
  let element: ProductTitleComponent;

  beforeEach(async () => {
    createInjector({
      providers: [
        ...MOCK_PRODUCT_PROVIDERS,
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

  const expectContentInTag = (tag: string) => {
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

  describe('tags', () => {
    expectContentInTag('h1');
    expectContentInTag('h2');
    expectContentInTag('h3');
    expectContentInTag('h4');
    expectContentInTag('h5');
    expectContentInTag('h6');

    describe('it should not render a tag', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<product-title sku="${mockSku}" .options=${{}}></product-title>`
        );
      });
      it(`should not render a tag`, () => {
        expect(
          element?.shadowRoot?.querySelectorAll('*:not(style)').length
        ).toBe(0);
      });

      it('should render product title as plain text', () => {
        const product = MockProductService.mockProducts.find(
          (data) => data.sku === mockSku
        );
        expect(element?.shadowRoot?.textContent).toContain(product?.name);
      });
    });
  });
});
