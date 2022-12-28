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
import { LoadingStrategy } from '@spryker-oryx/ui/image';

import { html } from 'lit';
import { ProductMediaComponent } from './media.component';
import { productMediaComponent } from './media.def';

class MockProductImageService implements Partial<ProductImageService> {
  resolveSources = vi.fn();
}

describe('ProductMediaComponent', () => {
  let element: ProductMediaComponent;
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
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render the oryx-image element with src', () => {
      expect(element).toContainElement('oryx-image[src]');
    });

    it('should not render a srcset attribute', () => {
      expect(element).not.toContainElement('oryx-image[srcset]');
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
      });

      it('should not render a srcset', () => {
        expect(element).not.toContainElement('oryx-image[srcset]');
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
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
      });

      it('should render the img element', () => {
        expect(element).toContainElement('oryx-image[src="a.jpg"]');
      });

      it('should render a srcset with the density', () => {
        expect(element).toContainElement('oryx-image[srcset="b.jpg 2x"]');
      });
    });
  });

  describe('when there are no images resolved', () => {
    beforeEach(async () => {
      service.resolveSources.mockReturnValue([]);
      element = await fixture(html`<product-media sku="1"></product-media>`);
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
        });

        it('should reflect the product name on the alt attribute', () => {
          expect(element).toContainElement(`oryx-image[alt="Sample product"]`);
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
        });

        it('should reflect the alt property on the alt attribute', () => {
          expect(element).toContainElement(`oryx-image[alt="custom-alt"]`);
        });
      });
    });

    describe('loading', () => {
      describe('when no loading strategy is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-media sku="1"></product-media>`
          );
        });

        it('should lazy load the image', () => {
          expect(element).toContainElement(`oryx-image[loading="lazy"]`);
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
        });

        it('should load the image immediately', () => {
          expect(element).toContainElement(`oryx-image[loading="eager"]`);
        });
      });
    });
  });
});
