import { resolve } from '@spryker-oryx/di';
import {
  ContentMixin,
  LayoutMixin,
  defaultOptions,
} from '@spryker-oryx/experience';
import { CarouselNavigationComponent } from '@spryker-oryx/experience/carousel-navigation';
import {
  ActiveImageService,
  ProductMedia,
  ProductMediaContainerSize,
  ProductMixin,
} from '@spryker-oryx/product';
import { computed, elementEffect, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  ProductImageListComponentOptions,
  ProductImageListNavigate,
} from './image-list.model';
import { productImageListStyles } from './image-list.styles';

@defaultOptions({
  size: ProductMediaContainerSize.Thumbnail,
})
@hydrate()
export class ProductImageListComponent extends ProductMixin(
  LayoutMixin(ContentMixin<ProductImageListComponentOptions>(LitElement))
) {
  static styles = productImageListStyles;

  protected activeImageService = resolve(ActiveImageService);
  protected initiateLink = false;

  protected $active = computed(() => {
    const { mediaSet } = this.$options();
    return this.activeImageService.get(this.sku!, mediaSet);
  });

  @elementEffect()
  protected navigate = (): void => {
    const active = this.$active();
    if (!this.initiateLink && active !== undefined) {
      const navigation =
        this.shadowRoot?.querySelector<CarouselNavigationComponent>(
          'oryx-carousel-navigation'
        );
      navigation?.navigate(active);
    }
    this.initiateLink = false;
  };

  protected override render(): TemplateResult | void {
    return this.renderLayout({
      template: this.renderImages(),
    });
  }

  protected renderImages(): TemplateResult {
    const media = this.resolveImages();

    return html`${media.map((_, i) => this.renderImage(i))}`;
  }

  protected renderImage(i: number): TemplateResult {
    const { size, navigate } = this.$options();
    const template = html`<oryx-product-media
      .options=${{
        mediaIndex: i,
        containerSize: size,
      }}
    ></oryx-product-media>`;

    return navigate === ProductImageListNavigate.Click ||
      navigate === ProductImageListNavigate.Hover
      ? html`<label
          aria-label=${`image ${i}`}
          @mouseover=${(e: Event) => this.onMouseover(e, i)}
          @input=${(e: InputEvent) => this.onInput(e, i)}
        >
          ${template}
          <input
            value=${i}
            type="radio"
            name=${ifDefined(this.uid)}
            ?checked=${i === 0}
          />
        </label>`
      : template;
  }

  protected onInput(e: InputEvent, index: number): void {
    const { mediaSet, navigate } = this.$options();
    if (navigate === ProductImageListNavigate.Click) {
      this.initiateLink = true;
      this.activeImageService.set(this.sku!, mediaSet, index);
    }
  }

  protected onMouseover(e: Event, index: number): void {
    const { mediaSet, navigate } = this.$options();
    if (navigate === ProductImageListNavigate.Hover) {
      this.initiateLink = true;
      this.activeImageService.set(this.sku!, mediaSet, index);
    }
  }

  protected resolveImages(): ProductMedia[] {
    const { mediaSet } = this.$options();
    return (
      (!mediaSet
        ? this.$product()?.mediaSet?.[0]
        : this.$product()?.mediaSet?.find((set) => set.name === mediaSet)
      )?.media ?? []
    );
  }
}
