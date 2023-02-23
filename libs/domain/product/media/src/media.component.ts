import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  ImageSource,
  ProductImageService,
  ProductMediaContainerSize,
  ProductMediaSet,
  ProductMixin,
} from '@spryker-oryx/product';
import { LoadingStrategy } from '@spryker-oryx/ui/image';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ProductMediaOptions } from './media.model';

@defaultOptions({
  loading: LoadingStrategy.Lazy,
  containerSize: ProductMediaContainerSize.Detail,
})
@hydratable('mouseover')
export class ProductMediaComponent extends ProductMixin(
  ContentMixin<ProductMediaOptions>(LitElement)
) {
  protected imageService = resolve(ProductImageService);

  protected override render(): TemplateResult | void {
    const { mediaIndex = 0, containerSize } = this.componentOptions ?? {};

    const productMedia = this.getMediaSet()?.media[mediaIndex];
    const sources = this.imageService.resolveSources(
      productMedia,
      containerSize
    );

    if (sources[0]?.url) {
      if (this.isVideo(sources[0]?.url)) {
        return this.renderVideo(sources[0]?.url);
      } else {
        return this.renderImage(sources[0]?.url, this.getSrcSet(sources));
      }
    }
  }

  protected isVideo(url: string): boolean {
    const videoRegex =
      /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|vimeo\.com\/|(?:https?:\/\/.*\.(?:mp4|avi|mov|wmv|flv|webm)))/;
    return videoRegex.test(url);
  }

  protected renderImage(src: string, srcSet?: string): TemplateResult | void {
    return html`<oryx-image
      src=${src}
      srcset=${ifDefined(srcSet)}
      alt=${ifDefined(this.componentOptions?.alt || this.product?.name)}
      loading=${ifDefined(this.componentOptions?.loading)}
    ></oryx-image>`;
  }

  protected renderVideo(src: string): TemplateResult | void {
    return html`<oryx-video url=${src}></oryx-video>`;
  }

  /**
   * Resolves the media set. When there's no mediaSet index provided, the first
   * media set is returned.
   */
  protected getMediaSet(): ProductMediaSet | undefined {
    if (this.componentOptions?.mediaSet) {
      return this.product?.mediaSet?.find(
        (set) => set.name === this.componentOptions?.mediaSet
      );
    } else {
      return this.product?.mediaSet?.[0];
    }
  }

  /**
   * Returns a list of srcset's that contain the url for each provided media
   * query and density.
   */
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
