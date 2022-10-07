import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import {
  ProductImagesComponentOptions,
  ProductImagesComponentSettings,
  ProductImagesNavigationDisplay,
  ProductImagesScrollBehavior,
  ProductImagesSet,
} from './images.model';
import { styles } from './images.styles';

@hydratable('mouseover')
export class ProductImagesComponent extends ProductComponentMixin<ProductImagesComponentOptions>() {
  static styles = styles;

  protected active$ = new BehaviorSubject(0);
  protected productController = new ProductController(this);
  protected contentController = new ContentController(this);
  protected product$ = this.productController.getProduct().pipe(
    tap(() => {
      this.setActive(0, ProductImagesScrollBehavior.Disable);
    })
  );
  protected options$ = this.contentController.getOptions().pipe(
    tap(() => {
      this.setActive(0, ProductImagesScrollBehavior.Disable);
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
      const settings: ProductImagesComponentSettings = {
        previewWidth: '300',
        previewHeight: '300',
        thumbWidth: '32',
        thumbHeight: '32',
        groupName: `product-image-nav-${this.uid}`,
        hidePreview: previewLayout === 'none',
        hideNavigation:
          navigationDisplay === ProductImagesNavigationDisplay.NONE ||
          images?.length <= 1,
        ...options,
      };
      return { settings, images, active };
    }),
    tap(({ settings }) => {
      this.setHostAttr('layout', settings.previewLayout);
      this.setHostAttr('nav-display', settings.navigationDisplay);
      this.setHostAttr('nav-layout', settings.navigationLayout);
      this.setHostAttr('nav-position', settings.navigationPosition);
      this.setHostAttr('nav-align', settings.navigationAlignment);
      this.setHostAttr('dir');
      if (
        window?.getComputedStyle?.(this)?.getPropertyValue?.('direction') ===
        'rtl'
      ) {
        this.setHostAttr('dir', 'rtl');
      }
    })
  );

  protected async setActive(
    active?: number,
    behavior: ProductImagesScrollBehavior = ProductImagesScrollBehavior.Auto
  ): Promise<void> {
    const items = this.shadowRoot?.querySelectorAll('picture');

    if (active !== undefined) {
      this.active$.next(active);
      const navItems: NodeListOf<HTMLInputElement> | undefined =
        this.shadowRoot?.querySelectorAll('.nav-item input');
      const activeNavItem = navItems?.[active];
      if (activeNavItem) {
        activeNavItem.checked = true;
      }
    }
    if (behavior === ProductImagesScrollBehavior.Disable) {
      (items?.[this.active$.getValue()]?.parentNode as Element)?.scrollTo(0, 0);

      return;
    }

    items?.[this.active$.getValue()]?.scrollIntoView({
      block: 'nearest',
      inline: 'start',
      behavior: behavior as ScrollBehavior,
    });
  }

  protected onInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    const active = target?.value || 0;
    this.setActive(+active, ProductImagesScrollBehavior.Smooth);
  }

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.productImages$, ({ settings, images, active }) => {
        return html`
          ${when(
            !settings.hidePreview,
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
            !settings.hideNavigation,
            () => html`
              <fieldset class="nav">
                ${images.map(
                  (image: ProductImagesSet, i: number) => html`
                    <label class="nav-item">
                      <input
                        value="${i}"
                        type="radio"
                        name="${ifDefined(settings.groupName)}"
                        ?checked="${i === active}"
                        @input="${(e: InputEvent): void => this.onInput(e)}"
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
