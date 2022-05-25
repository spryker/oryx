import { fixture } from '@open-wc/testing-helpers';
import { createInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { MOCK_PRODUCT_PROVIDERS } from '../../src/mocks';
import '../index';
import { ProductImageComponent } from './image.component';

describe('Image', () => {
  let element: ProductImageComponent;

  beforeEach(async () => {
    createInjector({
      providers: MOCK_PRODUCT_PROVIDERS,
      override: true,
    });
    element = await fixture(html`<product-image code="1"></product-image>`);
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(ProductImageComponent);
  });

  it('renders internal image', () => {
    const src =
      'https://images.icecat.biz/img/gallery_mediums/29885545_9575.jpg';
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
    element = await fixture(html`<product-image code="2"></product-image>`);
    const thumbs = element?.shadowRoot?.querySelector('.nav');
    expect(thumbs).toBeNull();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
