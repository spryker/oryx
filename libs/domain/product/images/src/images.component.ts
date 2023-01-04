import { ContentController } from '@spryker-oryx/experience';
import {
  Product,
  ProductComponentMixin,
  ProductController,
  ProductMedia,
  ProductMediaContainerSize,
} from '@spryker-oryx/product';
import { asyncValue, hydratable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { BehaviorSubject, combineLatest, Observable, tap } from 'rxjs';
import {
  ProductImagesComponentOptions,
  ProductImagesMainLayout,
  ProductImagesNavigationDisplay,
  ProductImagesNavigationMouseEvent,
  ProductImagesNavigationPosition,
  ProductImagesScrollBehavior,
} from './images.model';
import { styles } from './styles';

@hydratable('mouseover')
export class ProductImagesComponent extends ProductComponentMixin<ProductImagesComponentOptions>() {
  static styles = styles;

  protected product$ = new ProductController(this)
    .getProduct()
    .pipe((product) => this.reset(product));

  protected options$ = new ContentController(this)
    .getOptions()
    .pipe((options) => this.reset(options));

  protected active$ = new BehaviorSubject(0);

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        combineLatest([this.product$, this.options$, this.active$]),
        ([product, options, active]) => {
          const media = this.resolveImages(product, options);
          return this.wrap(
            options,
            this.renderMain(options, media, active),
            this.renderNavigation(options, media, active)
          );
        }
      )}
    `;
  }

  protected resolveImages(
    product: Product | null,
    options: Partial<ProductImagesComponentOptions>
  ): ProductMedia[] {
    const set = !options.mediaSet
      ? product?.mediaSet?.[0]
      : product?.mediaSet?.find((set) => set.name === options.mediaSet);
    return set?.media ?? [];
  }

  /**
   * Wrapper element that reflects layout options. The DOM order of the main
   * image and the navigation are _adapted_ based on the configured layout.
   * The order of the preview and navigation as well as the reflected options
   * are crucial for proper styling.
   *
   * We cannot set those on the host element, since there's no support for `style.setAttribute`
   * and `toggleAttribute` on the host in lit ssr.
   */
  protected wrap(
    options: ProductImagesComponentOptions,
    main: TemplateResult,
    navigation: TemplateResult
  ): TemplateResult {
    const cssVar = (prop: string, value?: number): string | undefined =>
      value ? `${prop}:${value}${isNaN(value) ? '' : 'px'};` : '';

    let style = '';
    style += cssVar('--product-images-main-height', options.mainImageHeight);
    style += cssVar('--product-images-main-width', options.mainImageWidth);
    style += cssVar('--product-images-thumb-height', options.thumbHeight);
    style += cssVar('--product-images-thumb-width', options.thumbWidth);
    if (options.gridItemsPerColumn) {
      style += `--oryx-grid-items-per-column: ${options.gridItemsPerColumn}`;
    }

    return html` <slot
      main-layout=${ifDefined(options.mainLayout)}
      nav-position=${ifDefined(options.navigationPosition)}
      nav-layout=${ifDefined(options.navigationLayout)}
      nav-display=${ifDefined(options.navigationDisplay)}
      nav-align=${ifDefined(options.navigationAlignment)}
      ?without-nav=${!navigation.values.length}
      style=${style}
    >
      ${when(
        options.navigationPosition === ProductImagesNavigationPosition.Top ||
          options.navigationPosition === ProductImagesNavigationPosition.Start,
        () => html`${navigation}${main}`,
        () => html`${main}${navigation}`
      )}
    </slot>`;
  }

  /**
   * Renders the main product image, aka the preview image.
   *
   * The preview image can be toggled when there are multiple images
   * available, using the image navigation.
   *
   * An empty image is returned when the `previewLayout` is `none`.
   */
  protected renderMain(
    options: ProductImagesComponentOptions,
    images: ProductMedia[],
    active: number
  ): TemplateResult {
    if (options.mainLayout === ProductImagesMainLayout.None) {
      return html``;
    }

    return html`<section class="preview">
      ${images.map(
        (_, i) => html`<product-media
          .sku=${this.sku}
          .options=${{
            mediaIndex: i,
            containerSize: ProductMediaContainerSize.Detail,
            alt: `preview${i + 1}`,
            loading: active !== i ? 'lazy' : undefined,
          }}
          ?active=${active === i}
        ></product-media>`
      )}
    </section>`;
  }

  /**
   * Renders an navigation with image thumbnails.
   *
   * An empty template is returned when the `navigationDisplay` is `none`
   * or when there is only a single image available.
   */
  protected renderNavigation(
    options: ProductImagesComponentOptions,
    images: ProductMedia[],
    active: number
  ): TemplateResult {
    if (
      options.navigationDisplay === ProductImagesNavigationDisplay.None ||
      images.length <= 1
    ) {
      return html``;
    }

    return html` <fieldset class="nav">
      ${images.map(
        (image: ProductMedia, i: number) => html`
          <label aria-label=${`image ${i}`}>
            <input
              value=${i}
              type="radio"
              name=${ifDefined(
                options.groupName ?? `product-image-nav-${this.uid}`
              )}
              ?checked=${i === active}
              @input=${this.onInput}
              @mouseover=${(e: Event): void => this.onMouseover(e, options)}
            />
            <product-media
              .sku=${this.sku}
              .options=${{
                mediaIndex: i,
                containerSize: ProductMediaContainerSize.Thumbnail,
                loading: active !== i ? 'lazy' : undefined,
              }}
              ?active=${active === i}
            ></product-media>
          </label>
        `
      )}
    </fieldset>`;
  }

  protected onInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    const active = target.value;
    this.setActive(+active, ProductImagesScrollBehavior.Smooth);
  }

  protected onMouseover(
    e: Event,
    options: ProductImagesComponentOptions
  ): void {
    if (
      options.navigationMouseEvent ===
      ProductImagesNavigationMouseEvent.Mouseover
    ) {
      (e.target as HTMLInputElement).dispatchEvent(
        new InputEvent('input', { bubbles: true, composed: true })
      );
    }
  }

  /**
   * Toggles the active navigation thumbnail and navigates to the
   * active preview image.
   *
   * When a `smooth` or `auto` behaviour is provided, the preview image
   * is scrolled into view using this behaviour.
   */
  protected setActive(
    active?: number,
    behavior: ProductImagesScrollBehavior = ProductImagesScrollBehavior.Auto
  ): void {
    if (active !== undefined) {
      this.active$.next(active);
      const navItems = this.shadowRoot?.querySelectorAll('input');
      navItems?.[active]?.toggleAttribute('checked', true);
    }

    const item = this.shadowRoot?.querySelectorAll<HTMLElement>(
      'section product-media'
    )?.[this.active$.getValue()];

    if (behavior === ProductImagesScrollBehavior.Disable) {
      (item?.parentNode as Element)?.scrollTo(0, 0);
    } else {
      (item?.parentNode as Element)?.scroll({
        left: item?.offsetLeft,
        behavior,
      });
    }
  }

  /**
   * Resets the thumbnail navigation. This is useful when the image data
   * is change (i.e. during page navigation) or when the options are changing.
   */
  protected reset<T>(source$: Observable<T>): Observable<T> {
    return source$.pipe(
      tap(() => this.setActive(0, ProductImagesScrollBehavior.Disable))
    );
  }
}
