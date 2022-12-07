import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
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
      html`<product-title sku="1" .options=${{ tag: 'h1' }}></product-title>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when a the link option is true', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<product-title sku="1" .options=${{ link: true }}></product-title>`
      );
    });

    it('should render the oryx-heading component', () => {
      expect(element).toContainElement('oryx-heading');
    });

    it('should wrap the element inside a link', () => {
      expect(element).toContainElement('content-link');
    });
  });

  describe('when a the link option is not true', () => {
    beforeEach(async () => {
      element = await fixture(html`<product-title sku="1"></product-title>`);
    });

    it('should render the oryx-heading component', () => {
      expect(element).toContainElement('oryx-heading');
    });

    it('should not wrap the element inside a link', () => {
      expect(element).not.toContainElement('content-link');
    });
  });
});
