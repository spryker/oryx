import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  ImageSource,
  ProductImageService,
  ProductMediaContainerSize,
  ProductMixin,
} from '@spryker-oryx/product';
import { LoadingStrategy } from '@spryker-oryx/ui/image';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { ProductMediaOptions } from './media.model';

@defaultOptions({
  loading: LoadingStrategy.Lazy,
  containerSize: ProductMediaContainerSize.Detail,
})
@hydrate({ event: ['mouseover', 'focusin'] })
export class ProductMediaComponent extends ProductMixin(
  ContentMixin<ProductMediaOptions>(LitElement)
) {
  protected imageService = resolve(ProductImageService);

  protected override render(): TemplateResult | void {
    const { mediaIndex = 0, containerSize } = this.$options();
    const sources = this.imageService.resolveSources(
      this.$mediaSet()?.media[mediaIndex],
      containerSize
    );

    const url = sources?.[0]?.url;
    if (!url) return this.renderImage();

    if (this.isVideo(url)) {
      return html`<oryx-video url=${url}></oryx-video>`;
    } else {
      return this.renderImage(url, this.getSrcSet(sources));
    }
  }

  protected renderImage(src?: string, srcSet?: string): TemplateResult | void {
    const { name } = this.$product() ?? {};
    const { alt = name, loading } = this.$options();
    return html`<oryx-image
      .src=${src}
      .srcset=${srcSet}
      .alt=${alt}
      .loading=${loading}
    ></oryx-image>`;
  }

  /**
   * Resolves the media set. When there's no mediaSet index provided, the first
   * media set is returned.
   */
  protected $mediaSet = computed(() => {
    const medias = this.$product()?.mediaSet;
    const { mediaSet } = this.$options();
    if (mediaSet) {
      return medias?.find((set) => set.name === mediaSet);
    } else {
      return medias?.[0];
    }
  });

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

  protected isVideo(url: string): boolean {
    const videoRegex =
      /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|vimeo\.com\/|(?:https?:\/\/.*\.(?:mp4|avi|mov|wmv|flv|webm)))/;
    return videoRegex.test(url);
  }
}
