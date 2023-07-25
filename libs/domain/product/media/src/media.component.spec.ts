import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  ImageSource,
  Product,
  ProductImageService,
  ProductMediaContainerSize,
  ProductService,
} from '@spryker-oryx/product';
import { LoadingStrategy } from '@spryker-oryx/ui/image';
import { Size, useComponent } from '@spryker-oryx/utilities';

import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { html } from 'lit';
import { of } from 'rxjs';
import { ProductMediaComponent } from './media.component';
import { productMediaComponent } from './media.def';

class MockProductImageService implements Partial<ProductImageService> {
  resolveSources = vi.fn();
}
class MockProductService implements Partial<ProductService> {
  get = vi.fn();
}

const img1 = {
  sm: 'https://images.icecat.biz/img/gallery_mediums/29885545_9575.jpg',
  lg: 'https://images.icecat.biz/img/gallery/29885545_9575.jpg',
};
const img2 = {
  sm: 'https://images.icecat.biz/img/norm/medium/26138343-5454.jpg',
  lg: 'https://images.icecat.biz/img/norm/high/26138343-5454.jpg',
};

const img3 = {
  sm: 'https://images.icecat.biz/img/gallery_mediums/30663301_9631.jpg',
  lg: 'https://images.icecat.biz/img/gallery/30663301_9631.jpg',
};

const images = [
  {
    ...img1,
    xl: img1.lg,
    externalUrlLarge: img1.lg,
    externalUrlSmall: img1.sm,
  },
  {
    ...img2,
    xl: img2.lg,
    externalUrlLarge: img2.lg,
    externalUrlSmall: img2.sm,
  },
  {
    ...img3,
    xl: img3.lg,
    externalUrlLarge: img3.lg,
    externalUrlSmall: img3.sm,
  },
];

describe('ProductMediaComponent', () => {
  let element: ProductMediaComponent;
  let service: MockProductImageService;
  let productService: MockProductService;

  beforeAll(async () => {
    await useComponent([productMediaComponent]);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ProductImageService,
          useClass: MockProductImageService,
        },

        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
        {
          provide: ProductService,
          useClass: MockProductService,
        },
      ],
    });
    service = testInjector.inject<MockProductImageService>(ProductImageService);
    productService = testInjector.inject<MockProductService>(ProductService);
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
      element = await fixture(
        html`<oryx-product-media sku="1"></oryx-product-media>`
      );
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should have oryx-image element with src property', () => {
      const image = element.renderRoot.querySelector('oryx-image');

      expect(element).toContainElement(`oryx-image`);
      expect(image).toHaveProperty('src');
    });

    it('should have oryx-image element without srcset property', () => {
      const image = element.renderRoot.querySelector('oryx-image');

      expect(element).toContainElement(`oryx-image`);
      expect(image).toHaveProperty('srcset', undefined);
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
        element = await fixture(
          html`<oryx-product-media sku="1"></oryx-product-media>`
        );
      });

      it('should have oryx-image element without srcset property', () => {
        const image = element.renderRoot.querySelector('oryx-image');

        expect(element).toContainElement(`oryx-image`);
        expect(image).toHaveProperty('srcset', undefined);
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
        element = await fixture(
          html`<oryx-product-media sku="1"></oryx-product-media>`
        );
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
      });

      it('should render the img element', () => {
        const image = element.renderRoot.querySelector('oryx-image');

        expect(element).toContainElement(`oryx-image`);
        expect(image).toHaveProperty('src', 'a.jpg');
      });

      it('should render a srcset with the density', () => {
        const image = element.renderRoot.querySelector('oryx-image');

        expect(element).toContainElement(`oryx-image`);
        expect(image).toHaveProperty('srcset', 'b.jpg 2x');
      });
    });
  });

  describe('when there are no images resolved', () => {
    beforeEach(async () => {
      service.resolveSources.mockReturnValue([]);
      element = await fixture(
        html`<oryx-product-media sku="1"></oryx-product-media>`
      );
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

    beforeEach(() => {
      productService.get.mockReturnValue(
        of({
          sku: '1',
          name: 'Sample product',
          mediaSet: [
            {
              name: 'default',
              media: images,
            },
          ],
        } as Product)
      );
    });

    describe('format', () => {
      describe('when no format is requested', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-media sku="1"></oryx-product-media>`
          );
        });

        it('should request images for the Detail format', () => {
          expect(service.resolveSources).toHaveBeenCalledWith(
            images[0],
            ProductMediaContainerSize.Detail
          );
        });
      });

      describe('when a format is requested', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-media
              sku="1"
              .options=${{ containerSize: ProductMediaContainerSize.Thumbnail }}
            ></oryx-product-media>`
          );
        });

        it('should request images for the Thumbnail format', () => {
          expect(service.resolveSources).toHaveBeenCalledWith(
            images[0],
            ProductMediaContainerSize.Thumbnail
          );
        });
      });
    });

    describe('mediaIndex', () => {
      describe('when no mediaIndex is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-media sku="1"></oryx-product-media>`
          );
        });

        it('should get the 1st image', () => {
          expect(service.resolveSources).toHaveBeenCalledWith(
            images[0],
            ProductMediaContainerSize.Detail
          );
        });
      });

      describe('when mediaIndex = 1', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-media
              sku="1"
              .options=${{ mediaIndex: 1 }}
            ></oryx-product-media>`
          );
        });

        it('should get the 2nd image', () => {
          expect(service.resolveSources).toHaveBeenCalledWith(
            images[1],
            ProductMediaContainerSize.Detail
          );
        });
      });
    });

    describe('alt', () => {
      describe('when alt option is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-media sku="1"></oryx-product-media>`
          );
        });

        it('should reflect the product name on the alt attribute', () => {
          expect(element).toContainElement(`oryx-image`);
          const image = element.renderRoot.querySelector('oryx-image');
          expect(image).toHaveProperty('alt', 'Sample product');
        });
      });

      describe('when a custom alt property is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-media
              sku="1"
              .options=${{ alt: 'custom-alt' }}
            ></oryx-product-media>`
          );
        });

        it('should reflect the alt property on the alt property', () => {
          const image = element.renderRoot.querySelector('oryx-image');

          expect(element).toContainElement(`oryx-image`);
          expect(image).toHaveProperty('alt', 'custom-alt');
        });
      });
    });

    describe('loading', () => {
      describe('when no loading strategy is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-media sku="1"></oryx-product-media>`
          );
        });

        it('should lazy load the image', () => {
          const image = element.renderRoot.querySelector('oryx-image');

          expect(element).toContainElement(`oryx-image`);
          expect(image).toHaveProperty('loading', 'lazy');
        });
      });

      describe('when eager loading strategy is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-media
              sku="1"
              .options=${{ loading: LoadingStrategy.Eager }}
            ></oryx-product-media>`
          );
        });

        it('should load the image immediately', () => {
          const image = element.renderRoot.querySelector('oryx-image');

          expect(element).toContainElement(`oryx-image`);
          expect(image).toHaveProperty('loading', 'eager');
        });
      });
    });

    describe('when mediaSet is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-media
            sku="1"
            .options=${{ mediaSet: 'default' }}
          ></oryx-product-media>`
        );
      });

      it('should render media resource', () => {
        expect(element).toContainElement('oryx-image');
      });
    });
  });

  describe('when video link is provided', () => {
    beforeEach(async () => {
      service.resolveSources.mockReturnValue([
        { url: 'https://www.youtube.com/watch?v=test' },
      ]);
      element = await fixture(
        html`<oryx-product-media sku="1"></oryx-product-media>`
      );
    });

    it('should render the video', () => {
      expect(element).toContainElement(`oryx-video`);
    });
  });
});
