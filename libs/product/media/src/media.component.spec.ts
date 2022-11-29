import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import {
  ImageSource,
  ProductImageService,
  ProductMediaContainerSize,
  Size,
} from '@spryker-oryx/product';
import {
  mockProductProviders,
  MockProductService,
} from '@spryker-oryx/product/mocks';
import { ImageComponent, LoadingStrategy } from '@spryker-oryx/ui/image';

import { html } from 'lit';
import { ProductMediaComponent } from './media.component';
import { productMediaComponent } from './media.def';

class MockProductImageService implements Partial<ProductImageService> {
  resolveSources = vi.fn();
}

describe('ProductMediaComponent', () => {
  let element: ProductMediaComponent;
  let image: ImageComponent | null | undefined;
  let service: MockProductImageService;

  beforeAll(async () => {
    await useComponent([productMediaComponent]);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        ...mockProductProviders,
        {
          provide: ProductImageService,
          useClass: MockProductImageService,
        },
      ],
    });
    service = testInjector.inject(
      ProductImageService
    ) as MockProductImageService;
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when an image is resolved', () => {
    beforeEach(async () => {
      service.resolveSources.mockReturnValue([
        {
          url: 'img.jpg',
          size: Size.Md,
        },
      ]);
      element = await fixture(html`<product-media sku="1"></product-media>`);
      image = element.shadowRoot?.querySelector('oryx-image');
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render the oryx-image element with src', () => {
      expect(image!.src).toBeDefined();
    });

    it('should not render a srcset attribute', () => {
      expect(image!.srcset).toBeUndefined();
    });
  });

  describe('when there are 2 images resolved', () => {
    describe('and the higher quality has no density factor', () => {
      beforeEach(async () => {
        service.resolveSources.mockReturnValue([
          {
            url: 'a.jpg',
            size: Size.Md,
          },
          {
            url: 'b.jpg',
            size: Size.Lg,
          },
        ] as ImageSource[]);
        element = await fixture(html`<product-media sku="1"></product-media>`);
        image = element.shadowRoot?.querySelector('oryx-image');
      });

      it('should not render a srcset', () => {
        expect(image!.srcset).toBeUndefined();
      });
    });

    describe('and the higher quality has a density factor', () => {
      beforeEach(async () => {
        service.resolveSources.mockReturnValue([
          {
            url: 'a.jpg',
            size: Size.Md,
          },
          {
            url: 'b.jpg',
            size: Size.Lg,
            context: {
              density: 2,
            },
          },
        ] as ImageSource[]);
        element = await fixture(html`<product-media sku="1"></product-media>`);
        image = element.shadowRoot?.querySelector('oryx-image');
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
      });

      it('should render the img element', () => {
        expect(image!.src).toBe(`a.jpg`);
      });

      it('should render a srcset with the density', () => {
        expect(image!.srcset).toBe(`b.jpg 2x`);
      });
    });
  });

  describe('when there are no images resolved', () => {
    beforeEach(async () => {
      service.resolveSources.mockReturnValue([]);
      element = await fixture(html`<product-media sku="1"></product-media>`);
      image = element.shadowRoot?.querySelector('oryx-image');
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render the oryx-image element', () => {
      expect(element).toContainElement(`oryx-image`);
    });
  });

  describe('properties', () => {
    beforeEach(() => {
      service.resolveSources.mockReturnValue([
        { url: 'img.jpg', size: Size.Md },
      ]);
    });

    describe('format', () => {
      const mockProduct = MockProductService.mockProducts.find(
        (p) => p.sku === '1'
      );
      const image = mockProduct?.mediaSet?.[0].media[0];

      describe('when no format is requested', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-media sku="1"></product-media>`
          );
        });

        it('should request images for the Gallery format', () => {
          expect(service.resolveSources).toHaveBeenCalledWith(
            image,
            ProductMediaContainerSize.Detail
          );
        });
      });

      describe('when a format is requested', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-media
              sku="1"
              .options=${{ containerSize: ProductMediaContainerSize.Thumbnail }}
            ></product-media>`
          );
        });

        it('should request images for the Thumbnail format', () => {
          expect(service.resolveSources).toHaveBeenCalledWith(
            image,
            ProductMediaContainerSize.Thumbnail
          );
        });
      });
    });

    describe('mediaIndex', () => {
      const mockProduct = MockProductService.mockProducts.find(
        (p) => p.sku === '3'
      );
      describe('when no mediaIndex is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-media sku="3"></product-media>`
          );
        });

        it('should get the 1st image', () => {
          const image = mockProduct?.mediaSet?.[0].media[0];
          expect(service.resolveSources).toHaveBeenCalledWith(
            image,
            ProductMediaContainerSize.Detail
          );
        });
      });

      describe('when mediaIndex = 1', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-media
              sku="3"
              .options=${{ mediaIndex: 1 }}
            ></product-media>`
          );
        });

        it('should get the 2nd image', () => {
          const mockProduct = MockProductService.mockProducts.find(
            (p) => p.sku === '3'
          );
          const image = mockProduct?.mediaSet?.[0].media[1];
          expect(service.resolveSources).toHaveBeenCalledWith(
            image,
            ProductMediaContainerSize.Detail
          );
        });
      });
    });

    describe('alt', () => {
      describe('when alt option is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-media sku="1"></product-media>`
          );
          image = element.shadowRoot?.querySelector('oryx-image');
        });

        it('should reflect the product name on the alt attribute', () => {
          expect(image!.alt).toBe('Sample product');
        });
      });

      describe('when a custom alt property is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-media
              sku="1"
              .options=${{ alt: 'custom-alt' }}
            ></product-media>`
          );
          image = element.shadowRoot?.querySelector('oryx-image');
        });

        it('should reflect the alt property on the alt attribute', () => {
          expect(image!.alt).toBe('custom-alt');
        });
      });
    });

    describe('loading', () => {
      describe('when no loading strategy is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-media sku="1"></product-media>`
          );
          image = element.shadowRoot?.querySelector('oryx-image');
        });

        it('should lazy load the image', () => {
          expect(image!.loading).toBe('lazy');
        });
      });

      describe('when eager loading strategy is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-media
              sku="1"
              .options=${{ loading: LoadingStrategy.Eager }}
            ></product-media>`
          );
          image = element.shadowRoot?.querySelector('oryx-image');
        });

        it('should lazy load the image', () => {
          expect(image!.loading).toBe('eager');
        });
      });
    });
  });
});
