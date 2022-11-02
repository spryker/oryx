import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { mockProductProviders } from '../../mocks/src';
import { ImageSource, ProductMediaContainerSize } from '../../models';
import { DefaultProductImageService } from './default-product-image.service';
import { ProductImageService } from './product-image.service';

describe('DefaultProductImageService', () => {
  let service: ProductImageService;

  beforeEach(() => {
    const testInjector = createInjector({ providers: mockProductProviders });
    service = testInjector.inject(ProductImageService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultProductImageService);
  });

  let result: ImageSource[];

  describe('when the image is undefined', () => {
    beforeEach(() => {
      result = service.resolveSources(
        undefined,
        ProductMediaContainerSize.Detail
      );
    });

    it('should return an empty array', () => {
      expect(result.length).toBe(0);
    });

    describe('and the format is undefined as well', () => {
      beforeEach(() => {
        result = service.resolveSources();
      });

      it('should return an empty array', () => {
        expect(result.length).toBe(0);
      });
    });
  });

  describe('when the format is undefined', () => {
    beforeEach(() => {
      result = service.resolveSources({ sm: 'mock.jpg' });
    });

    it('should return an empty array', () => {
      expect(result.length).toBe(0);
    });
  });

  describe('when there is a matching image available', () => {
    beforeEach(() => {
      result = service.resolveSources(
        { lg: 'lg.jpg' },
        ProductMediaContainerSize.Detail
      );
    });

    it('should return the right quality', () => {
      expect(result[0].url).toBe('lg.jpg');
    });
  });

  describe('when there are more images provided', () => {
    beforeEach(() => {
      result = service.resolveSources(
        { xs: 'xs.jpg', sm: 'sm.jpg', lg: 'lg.jpg' },
        ProductMediaContainerSize.Detail
      );
    });

    it('should return only 1 image', () => {
      expect(result.length).toBe(1);
      expect(result[0].url).toBe('lg.jpg');
    });
  });

  describe('when there are more applicable qualities available', () => {
    describe('and there is 4g connection', () => {
      beforeEach(() => {
        vi.stubGlobal('navigator', { connection: { effectiveType: '4g' } });
        result = service.resolveSources(
          { lg: 'lg.jpg', xl: 'xl.jpg' },
          ProductMediaContainerSize.Detail
        );
      });

      it('should return both images', () => {
        expect(result.length).toBe(2);
        expect(result[0].url).toBe('lg.jpg');
        expect(result[1].url).toBe('xl.jpg');
      });
    });

    describe('and there is a 3g connection', () => {
      beforeEach(() => {
        vi.stubGlobal('navigator', { connection: { effectiveType: '3g' } });
        result = service.resolveSources(
          { lg: 'lg.jpg', xl: 'xl.jpg' },
          ProductMediaContainerSize.Detail
        );
      });

      it('should only return the low quality image', () => {
        expect(result.length).toBe(1);
        expect(result[0].url).toBe('lg.jpg');
      });
    });
  });

  describe('when there is no matching image available', () => {
    describe('and there are lower quality images available', () => {
      beforeEach(() => {
        result = service.resolveSources(
          { xs: 'xs.jpg', sm: 'sm.jpg', md: 'md.jpg' },
          ProductMediaContainerSize.Detail
        );
      });

      it('should return the first lower available quality', () => {
        expect(result.length).toBe(1);
        expect(result[0].url).toBe('md.jpg');
      });
    });

    describe('and there higher quality image available', () => {
      beforeEach(() => {
        result = service.resolveSources(
          { lg: 'lg.jpg', xl: 'xl.jpg' },
          ProductMediaContainerSize.Thumbnail
        );
      });

      it('should return the first lower available quality', () => {
        expect(result.length).toBe(1);
        expect(result[0].url).toBe('lg.jpg');
      });
    });
  });

  describe('when there is no matching config available', () => {
    beforeEach(() => {
      result = service.resolveSources(
        { xs: 'xs.jpg', xl: 'xl.jpg', lg: 'lg.jpg' },
        'foo' as ProductMediaContainerSize
      );
    });

    it('should return the highest quality', () => {
      expect(result.length).toBe(1);
      expect(result[0].url).toBe('xl.jpg');
    });
  });
});
