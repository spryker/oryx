import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { mockProductProviders, MockProductService } from '../../src/mocks';
import { productMediaComponent } from './component';
import { ProductMediaComponent } from './media.component';

describe('ProductMediaComponent', () => {
  const defaultWindowWidth = window.innerWidth;
  let element: ProductMediaComponent;

  const getImg = (): HTMLImageElement | null =>
    element.renderRoot.querySelector('img');

  const setWindowWidth = (innerWidth = defaultWindowWidth): void => {
    window.innerWidth = innerWidth;
    window.dispatchEvent(new Event('resize'));
  };

  beforeAll(async () => {
    await useComponent(productMediaComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: mockProductProviders,
    });
    element = await fixture(html`<product-media sku="1"></product-media>`);
  });

  afterEach(() => {
    destroyInjector();
    setWindowWidth();
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
      const src =
        MockProductService?.mockProducts?.[0]?.images?.[0]?.externalUrlLarge;
      const options = {
        src,
        hdSrc: src,
        alt: 'test',
        breakpoint: 400,
        loading: undefined,
      };

      beforeEach(async () => {
        element = await fixture(html`
          <product-media sku="1" .options=${options}></product-media>
        `);

        getImg()?.dispatchEvent(new Event('load'));
      });

      it('should render content correctly', () => {
        const img = element.renderRoot.querySelector('img');
        const source = element.renderRoot.querySelector('source');

        expect(img?.src).toBe(options.src);
        expect(img?.alt).toBe(options.alt);
        expect(img?.hasAttribute('loading')).toBe(false);
        expect(source?.getAttribute('media')).toContain('(min-width: 400px)');
      });

      it('should set "fetched" attribute', async () => {
        await elementUpdated(element);
        expect(element.hasAttribute('fetched')).toBe(true);
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
        expect(element).not.toContainElement('source');
      });
    });

    describe('with invalid data', () => {
      describe('when src is wrong', () => {
        const options = { src: '/src', hdSrc: '/hdSrc' };
        beforeEach(async () => {
          element = await fixture(html`
            <product-media sku="1" .options=${options}></product-media>
          `);

          setWindowWidth(400);

          getImg()?.dispatchEvent(new Event('error'));

          await elementUpdated(element);
        });

        it('should replace src by hdSrc', () => {
          expect(getImg()?.src).toContain(options.hdSrc);
        });

        it('should not render the source', () => {
          expect(element).not.toContainElement('source');
        });
      });

      describe('when hdSrc is wrong', () => {
        beforeEach(async () => {
          element = await fixture(html`
            <product-media sku="1"></product-media>
          `);

          getImg()?.dispatchEvent(new Event('error'));

          await elementUpdated(element);
        });

        it('should not render the source', () => {
          expect(element).not.toContainElement('source');
        });
      });

      describe('when product images are not specified', () => {
        beforeEach(async () => {
          element = await fixture(html`
            <product-media sku="without-images"></product-media>
          `);

          setWindowWidth(400);

          getImg()?.dispatchEvent(new Event('error'));

          await elementUpdated(element);
        });

        it('should not render the picture', async () => {
          expect(element).not.toContainElement('picture');
        });

        it('should set fallback attribute', async () => {
          expect(element.hasAttribute('fallback')).toBe(true);
        });
      });

      describe('when src and hdSrc are invalid options', () => {
        const options = { src: 'test', hdSrc: null };
        beforeEach(async () => {
          element = await fixture(html`
            <product-media sku="1" .options=${options}></product-media>
          `);

          getImg()?.dispatchEvent(new Event('error'));

          await elementUpdated(element);
        });

        it('should not render the picture', async () => {
          expect(element).not.toContainElement('picture');
        });

        it('should set fallback attribute', async () => {
          expect(element.hasAttribute('fallback')).toBe(true);
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
