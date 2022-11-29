import { ContentController } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import {
  ImageSource,
  Product,
  ProductComponentMixin,
  ProductController,
  ProductImageService,
  ProductMedia,
  ProductMediaContainerSize,
} from '@spryker-oryx/product';
import { LoadingStrategy } from '@spryker-oryx/ui/image';
import { hydratable } from '@spryker-oryx/utilities';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { combineLatest, map, Observable } from 'rxjs';
import { ProductMediaOptions, ResponsiveImage } from './media.model';

@hydratable('mouseover')
export class ProductMediaComponent extends ProductComponentMixin<ProductMediaOptions>() {
  protected imageService = resolve(ProductImageService);

  protected override render(): TemplateResult {
    return html`${asyncValue(
      this.productMedia$,
      (image: ResponsiveImage): TemplateResult => {
        return html`<oryx-image
          .src=${image.src}
          .srcset=${image.srcset}
          .alt=${image.alt}
          .loading=${image.loading ?? LoadingStrategy.Lazy}
        ></oryx-image>`;
      }
    )}`;
  }

  protected productMedia$: Observable<ResponsiveImage> = combineLatest([
    new ContentController(this).getOptions(),
    new ProductController(this).getProduct(),
  ]).pipe(
    map(([options, product]) => {
      const image = this.resolveImage(product, options);
      const sources = this.imageService.resolveSources(
        image,
        options?.containerSize ?? ProductMediaContainerSize.Detail
      );

      return {
        src: sources?.[0]?.url,
        alt: options?.alt || product?.name,
        srcset: this.getSrcSet(sources),
        loading: options?.loading,
      } as ResponsiveImage;
    })
  );

  protected resolveImage(
    product: Product | null,
    options: Partial<ProductMediaOptions>
  ): ProductMedia | undefined {
    const set = !options.mediaSet
      ? product?.mediaSet?.[0]
      : product?.mediaSet?.find((set) => set.name === options.mediaSet);
    return set?.media?.[options?.mediaIndex ?? 0];
  }

  protected getSrcSet(sources: ImageSource[]): string | undefined {
    if (sources.length < 2) {
      return;
    }

    return (
      sources
        .map((source): string | undefined =>
          source.context?.density
            ? `${source.url} ${source.context?.density}x`
            : undefined
        )
        .filter((s) => s)
        .join(',') || undefined
    );
  }
}
