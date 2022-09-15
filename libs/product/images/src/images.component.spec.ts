import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { mockProductProviders, MockProductService } from '../../src/mocks';
import { productImagesComponent } from './component';
import { ProductImagesComponent } from './images.component';

class MockExperienceContentService implements Partial<ExperienceService> {
  getOptions = ({ uid = '' }): Observable<any> => of({});
}

describe('ProductImagesComponent', () => {
  let element: ProductImagesComponent;

  beforeAll(async () => {
    await useComponent(productImagesComponent);
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
    element = await fixture(html`<product-images sku="1"></product-images>`);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(ProductImagesComponent);
  });

  it('renders internal image', () => {
    const src = MockProductService.mockProducts.find(({ sku }) => sku === '1')
      ?.images?.[0].externalUrlLarge;

    const firstPreview = element?.shadowRoot?.querySelector('picture');
    expect(firstPreview).toBeDefined();
    expect(firstPreview?.querySelector('img')?.src).toBe(src);
  });

  it('first preview is active on initial loading', () => {
    const firstPreview = element?.shadowRoot?.querySelector('picture');
    expect(firstPreview?.classList.contains('active')).toBe(true);
  });

  it('render thumbs by default when there are more than 1 product image to preview', () => {
    const thumbs = element?.shadowRoot?.querySelectorAll('.nav-item');
    expect(thumbs).toBeDefined();
    expect(thumbs?.length).toBe(3);
  });

  it('hides thumbs by default when there is only 1 product image to preview', async () => {
    element = await fixture(html`<product-images sku="2"></product-images>`);
    const thumbs = element?.shadowRoot?.querySelector('.nav');
    expect(thumbs).toBeNull();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
