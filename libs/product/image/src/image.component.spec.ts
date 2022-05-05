import { fixture } from '@open-wc/testing-helpers';
import { createInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing/a11y';
import { html } from 'lit';
import { MOCK_PRODUCT_PROVIDERS } from '../../src/mocks';
import '../index';
import { ImageComponent } from './image.component';

describe('Image', () => {
  let element: ImageComponent;

  beforeEach(async () => {
    createInjector({
      providers: MOCK_PRODUCT_PROVIDERS,
      override: true,
    });
    element = await fixture(html`<product-image code="1"></product-image>`);
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(ImageComponent);
  });

  it('renders internal image', () => {
    const src = 'https://images.icecat.biz/img/norm/high/27295368-2600.jpg';
    const item = element?.shadowRoot?.querySelector('.preview-item');
    expect(item).toBeDefined();
    expect(item?.querySelector('img')?.src).toBe(src);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
