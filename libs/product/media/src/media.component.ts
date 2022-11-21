import { ContentController } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import {
  ImageSource,
  ProductComponentMixin,
  ProductController,
  ProductImageService,
  ProductMediaContainerSize,
} from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import {
  LoadingStrategy,
  ProductMediaOptions,
  ResponsiveImage,
} from './media.model';
import { styles } from './media.styles';

@hydratable('mouseover')
export class ProductMediaComponent extends ProductComponentMixin<ProductMediaOptions>() {
  static styles = styles;

  protected product$ = new ProductController(this).getProduct();
  protected options$ = new ContentController(this).getOptions();
  protected invalid$ = new BehaviorSubject(false);

  protected imageService = resolve(ProductImageService);

  protected productMedia$: Observable<ResponsiveImage> = combineLatest([
    this.options$,
    this.product$,
    this.invalid$,
  ]).pipe(
    map(([options, product, invalid]) => {
      if (invalid) {
        return {};
      }

      const image = product?.images?.[options?.mediaIndex ?? 0];
      const sources = this.imageService.resolveSources(
        image,
        options?.containerSize ?? ProductMediaContainerSize.Detail
      );

      return {
        src: sources?.[0]?.url,
        alt: options?.alt || product?.name,
        srcset: this.getSrcSet(sources),
        loading: options?.loading ?? LoadingStrategy.Lazy,
      };
    })
  );

  protected override render(): TemplateResult {
    return html` ${asyncValue(
      this.productMedia$,
      (image: ResponsiveImage): TemplateResult => {
        const { src, srcset, alt, loading } = image;

        if (!src) {
          return html`<oryx-icon type="image" part="fallback"></oryx-icon>`;
        }

        return html`
          <img
            src=${src}
            srcset=${ifDefined(srcset)}
            .alt=${alt}
            loading=${ifDefined(loading)}
            @error=${this.onError}
          />
        `;
      }
    )}`;
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

  protected onError(): void {
    this.invalid$.next(true);
  }
}
