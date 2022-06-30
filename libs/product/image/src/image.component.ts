import { hydratable } from '@spryker-oryx/core';
import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import {
  ProductImageComponentOptions,
  ProductImageComponentSettings,
  ProductImageNavigationDisplay,
  ProductImagePreviewLayout,
  ProductImageSet,
} from './image.model';
import { styles } from './image.styles';

@hydratable('mouseover')
export class ProductImageComponent extends ProductComponentMixin<ProductImageComponentOptions>() {
  static styles = styles;

  protected active$ = new BehaviorSubject(0);
  protected productController = new ProductController(this);
  protected contentController = new ContentController(this);
  protected product$ = this.productController.getProduct().pipe(
    tap(() => {
      this.setActive(0);
    })
  );
  protected options$ = this.contentController.getOptions().pipe(
    tap((options) => {
      this.setActive(0, options?.previewLayout);
    })
  );

  protected setHostAttr(attr: string, val?: string): void {
    if (val) {
      this.setAttribute(attr, val);
      return;
    }

    this.removeAttribute(attr);
  }

  protected productImages$ = combineLatest([
    this.options$,
    this.product$,
    this.active$,
  ]).pipe(
    map(([options, product, active]) => {
      const { previewLayout, navigationDisplay } = options || {};
      const images = product?.images || [];
      const settings: ProductImageComponentSettings = {
        previewWidth: '300',
        previewHeight: '300',
        thumbWidth: '32',
        thumbHeight: '32',
        groupName: `product-image-nav-${this.uid}`,
        showPreview: previewLayout !== 'none',
        showNavigation:
          navigationDisplay !== ProductImageNavigationDisplay.NONE &&
          images?.length > 1,
        ...options,
      };
      return { settings, images, active };
    }),
    tap(({ settings }) => {
      this.setHostAttr('layout', settings.previewLayout);
      this.setHostAttr('nav-position', settings.navigationPosition);
      this.setHostAttr('nav-layout', settings.navigationLayout);
      this.setHostAttr('nav-display', settings.navigationDisplay);
      if (
        window?.getComputedStyle?.(this)?.getPropertyValue?.('direction') ===
        'rtl'
      ) {
        this.setHostAttr('dir', 'rtl');
      }
    })
  );

  protected setActive(
    active: number,
    layout?: ProductImagePreviewLayout
  ): void {
    this.active$.next(active);
    const navItems: NodeListOf<HTMLInputElement> | undefined =
      this.shadowRoot?.querySelectorAll('.nav-item input');
    const activeNavItem = navItems?.[active];
    if (activeNavItem) {
      activeNavItem.checked = true;
    }
    if (layout === ProductImagePreviewLayout.TOGGLE) {
      return;
    }
    const items = this.shadowRoot?.querySelectorAll('picture') || [];

    items[active]?.scrollIntoView({ block: 'nearest', inline: 'start' });
  }

  protected onInput(
    e: InputEvent,
    layout: ProductImagePreviewLayout | undefined
  ): void {
    const target = e.target as HTMLInputElement;
    const active = target?.value || 0;
    this.setActive(+active, layout);
  }

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.productImages$, ({ settings, images, active }) => {
        return html`
          ${when(
            settings.showPreview,
            () => html`
              <section>
                ${images.map(
                  (image, i) => html`
                    <picture
                      class="${ifDefined(active === i ? 'active' : undefined)}"
                    >
                      <img
                        src="${image.externalUrlLarge}"
                        alt="preview${i + 1}"
                        width="${ifDefined(settings.previewWidth)}"
                        height="${ifDefined(settings.previewHeight)}"
                        loading="${ifDefined(
                          active !== i ? 'lazy' : undefined
                        )}"
                      />
                    </picture>
                  `
                )}
              </section>
            `
          )}
          ${when(
            settings.showNavigation,
            () => html`
              <fieldset class="nav">
                ${images.map(
                  (image: ProductImageSet, i: number) => html`
                    <label class="nav-item">
                      <input
                        value="${i}"
                        type="radio"
                        name="${ifDefined(settings.groupName)}"
                        ?checked="${i === active}"
                        @input="${(e: InputEvent): void =>
                          this.onInput(e, settings.previewLayout)}"
                      />
                      <img
                        src="${image.externalUrlSmall}"
                        alt="${ifDefined(settings.groupName)}"
                        width="${ifDefined(settings.thumbWidth)}"
                        height="${ifDefined(settings.thumbHeight)}"
                        loading="lazy"
                      />
                    </label>
                  `
                )}
              </fieldset>
            `
          )}
        `;
      })}
    `;
  }
}
