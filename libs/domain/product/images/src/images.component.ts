import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  ProductMedia,
  ProductMediaContainerSize,
  ProductMixin,
} from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import {
  ProductImagesComponentOptions,
  ProductImagesMainLayout,
  ProductImagesNavigationDisplay,
  ProductImagesNavigationLayout as NavigationLayout,
  ProductImagesNavigationMouseEvent,
  ProductImagesNavigationPosition as NavigationPosition,
} from './images.model';
import { productImageStyles } from './images.styles';

const heightFallback = '300px';
const navigationHeightFallback = '80px';
const objectFitFallback = 'contain';

@defaultOptions({
  imageLayout: ProductImagesMainLayout.Carousel,
  navigationLayout: NavigationLayout.Grid,
  navigationPosition: NavigationPosition.Bottom,
  imageObjectFit: objectFitFallback,
  navigationObjectFit: objectFitFallback,
  imageHeight: heightFallback,
  navigationHeight: navigationHeightFallback,
} as ProductImagesComponentOptions)
@hydratable('mouseover')
export class ProductImagesComponent extends ProductMixin(
  ContentMixin<ProductImagesComponentOptions>(LitElement)
) {
  static styles = productImageStyles;

  @state() set active(value: number) {
    this.scrollToImage(value);
  }

  protected override render(): TemplateResult | void {
    if (this.product) {
      const media = this.resolveImages();
      const main = this.renderMainLayout(media);
      const navigation = this.renderNavigationLayout(media);

      return html`
        <oryx-layout
          navigation=${this.componentOptions?.navigationPosition ||
          NavigationPosition.Bottom}
          ?floating=${this.componentOptions?.navigationDisplay ===
          ProductImagesNavigationDisplay.Floating}
          style="--product-image-height: ${this.componentOptions?.imageHeight ||
          heightFallback};"
        >
          ${when(
            this.componentOptions?.navigationPosition ===
              NavigationPosition.Top ||
              this.componentOptions?.navigationPosition ===
                NavigationPosition.Start,
            () => html`${navigation}${main}`,
            () => html`${main}${navigation}`
          )}
        </oryx-layout>
      `;
    }
  }

  protected renderMainLayout(media: ProductMedia[]): TemplateResult | void {
    const {
      imageLayout: layout,
      imageObjectFit: objectFit,
      scrollBehavior,
    } = this.componentOptions ?? {};

    if (!media.length || layout === ProductImagesMainLayout.None) {
      return;
    }

    return html`<oryx-layout
      class="main"
      .layout=${layout || ProductImagesMainLayout.Carousel}
      style="--image-fit:${objectFit || objectFitFallback}"
      behavior=${ifDefined(scrollBehavior)}
    >
      ${media.map(
        (_, i) => html`
          <oryx-product-media
            .sku=${this.sku}
            .options=${{
              mediaIndex: i,
              containerSize: ProductMediaContainerSize.Thumbnail,
              loading: this.active !== i ? 'lazy' : undefined,
            }}
            ?active=${this.active === i}
          ></oryx-product-media>
        `
      )}
    </oryx-layout>`;
  }

  protected renderNavigationLayout(
    media: ProductMedia[]
  ): TemplateResult | void {
    const {
      navigationDisplay: display,
      navigationLayout: layout,
      navigationPosition: position,
      navigationHeight: height,
      navigationObjectFit: objectFit,
    } = this.componentOptions ?? {};

    if (media.length < 2 || display === ProductImagesNavigationDisplay.None) {
      return;
    }

    return html`<oryx-layout
      class="navigation"
      .layout=${layout || NavigationLayout.Carousel}
      .vertical=${position === NavigationPosition.Start ||
      position === NavigationPosition.End}
      style="--item-size:${height ||
      navigationHeightFallback};--image-fit:${objectFit || objectFitFallback}"
    >
      ${media.map(
        (_, i) => html`
          <label aria-label=${`image ${i}`}>
            <input
              value=${i}
              type="radio"
              name=${ifDefined(this.uid)}
              ?checked=${i === 0}
              @input=${this.onInput}
              @mouseover=${this.onMouseover}
            />

            <oryx-product-media
              .sku=${this.sku}
              .options=${{
                mediaIndex: i,
                containerSize: ProductMediaContainerSize.Thumbnail,
                loading: this.active !== i ? 'lazy' : undefined,
              }}
              ?active=${this.active === i}
            ></oryx-product-media>
          </label>
        `
      )}
    </oryx-layout>`;
  }

  protected onInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    this.active = Number(target.value);
  }

  protected onMouseover(e: Event): void {
    const { navigationMouseEvent } = this.componentOptions ?? {};
    if (navigationMouseEvent === ProductImagesNavigationMouseEvent.Mouseover) {
      const target = e.target as HTMLInputElement;
      this.active = Number(target.value);
    }
  }

  protected scrollToImage(value: number): void {
    const media = this.shadowRoot?.querySelectorAll<HTMLElement>(
      '.main oryx-product-media'
    )?.[value];
    (media?.parentNode as Element)?.scroll({
      left: media?.offsetLeft,
    });
  }

  protected resolveImages(): ProductMedia[] {
    const set = !this.componentOptions?.mediaSet
      ? this.product?.mediaSet?.[0]
      : this.product?.mediaSet?.find(
          (set) => set.name === this.componentOptions?.mediaSet
        );
    return set?.media ?? [];
  }
}
