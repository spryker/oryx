import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { MockProductService, MOCK_PRODUCT_PROVIDERS } from '../../src/mocks';
import { productMediaComponent } from './index';
import { ProductMediaComponent } from './media.component';

useComponent(productMediaComponent);

describe('ProductMediaComponent', () => {
  let element: ProductMediaComponent;

  beforeEach(async () => {
    createInjector({
      providers: MOCK_PRODUCT_PROVIDERS,
    });
    element = await fixture(html`<product-media sku="1"></product-media>`);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render product first images', () => {
    const expectationSmall =
      MockProductService?.mockProducts?.[0]?.images?.[0]?.externalUrlSmall;
    const expectationLarge =
      MockProductService?.mockProducts?.[0]?.images?.[0]?.externalUrlLarge;
    const img = element?.shadowRoot?.querySelector('img');
    const source = element?.shadowRoot?.querySelector('source');

    expect(img?.src).toBe(expectationSmall);
    expect(source?.srcset).toBe(expectationLarge);
  });

  it('should render product name as alt', () => {
    const expectation = MockProductService?.mockProducts?.[0]?.name;
    const img = element?.shadowRoot?.querySelector('img');
    expect(img?.alt).toBe(expectation);
  });

  describe('when options provided', () => {
    describe('with valid data', () => {
      const options = {
        src: MockProductService?.mockProducts?.[0]?.images?.[0]
          ?.externalUrlLarge,
        hdSrc:
          MockProductService?.mockProducts?.[1]?.images?.[0]?.externalUrlLarge,
        alt: 'test',
        breakpoint: 400,
        loading: undefined,
      };

      beforeEach(async () => {
        element = await fixture(html`
          <product-media sku="1" .options=${options}></product-media>
        `);
      });

      it('should render content correctly', () => {
        const img = element.renderRoot.querySelector('img');
        const source = element.renderRoot.querySelector('source');

        expect(img?.src).toBe(options.src);
        expect(img?.alt).toBe(options.alt);
        expect(img?.hasAttribute('loading')).toBe(false);
        expect(source?.getAttribute('media')).toBe('(min-width: 400px)');
      });
    });

    describe('when hdSrc is null', () => {
      const options = {
        hdSrc: null,
      };

      beforeEach(async () => {
        element = await fixture(html`
          <product-media sku="1" .options=${options}></product-media>
        `);
      });

      it('should not render hd version', () => {
        const source = element.renderRoot.querySelector('source');

        expect(source).toBeNull();
      });
    });

    describe('with invalid data', () => {
      describe('when src is wrong', () => {
        const options = {
          src: '',
        };

        beforeEach(async () => {
          element = await fixture(html`
            <product-media sku="1" .options=${options}></product-media>
          `);
        });

        it('should not render the image', () => {
          const img = element.renderRoot.querySelector('oryx-image');

          expect(img).toBeNull();
        });
      });

      describe('when alt is wrong', () => {
        const options = {
          alt: undefined,
        };

        beforeEach(async () => {
          element = await fixture(html`
            <product-media sku="1" .options=${options}></product-media>
          `);
        });

        it('should not set alt attribute', () => {
          const img = element.renderRoot.querySelector('img');

          expect(img?.hasAttribute('alt')).toBe(false);
        });
      });
    });
  });
});
