import { hydratable } from '@spryker-oryx/core';
import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { ProductController } from '../../src';
import {
  ProductImageComponentContent,
  ProductImageComponentSettings,
  ProductImageNavigationDisplay,
  ProductImagePreviewLayout,
  ProductImageSet,
} from './image.model';
import { styles } from './image.styles';

@hydratable('mouseover')
export class ProductImageComponent extends LitElement {
  static styles = styles;

  @property({ type: String }) uid?: string;
  @property({ type: String }) sku?: string;

  protected groupName = `product-image-nav-${this.uid}`;

  protected active$ = new BehaviorSubject(0);
  protected product$ = new ProductController(this).product$;
  protected content$ = new ContentController<ProductImageComponentContent>(this)
    .content$;

  protected setHostAttr(attr: string, val?: string): void {
    if (val) {
      this.setAttribute(attr, val);
      return;
    }

    this.removeAttribute(attr);
  }

  protected productImages$ = combineLatest([
    this.content$,
    this.active$,
    this.product$.pipe(tap(() => this.active$.next(0))),
  ]).pipe(
    map(([content, active, product]) => {
      const { previewLayout, navigationDisplay } = content || {};
      const images = product?.images || [];
      const settings: ProductImageComponentSettings = {
        previewWidth: '300',
        previewHeight: '300',
        thumbWidth: '32',
        thumbHeight: '32',
        groupName: this.groupName,
        showPreview: previewLayout !== 'none',
        showNavigation:
          navigationDisplay !== ProductImageNavigationDisplay.NONE &&
          images?.length > 1,
        ...content,
      };
      return { settings, active, images };
    }),
    tap(({ settings }) => {
      this.setHostAttr('layout', settings.previewLayout);
      this.setHostAttr('nav-position', settings.navigationPosition);
      this.setHostAttr('nav-layout', settings.navigationLayout);
      this.setHostAttr('nav-display', settings.navigationDisplay);
    })
  );

  protected setActive(
    active: number,
    layout?: ProductImagePreviewLayout
  ): void {
    this.active$.next(active);
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
      ${asyncValue(this.productImages$, ({ settings, active, images }) => {
        return html`
          ${when(
            settings.showPreview,
            () => html`
              <section>
                ${images.map(
                  (image, i) => html`
                    <picture
                      class="${ifDefined(active === i ? 'active' : null)}"
                    >
                      <img
                        .src="${image.externalUrlLarge}"
                        .alt="preview${i + 1}"
                        width="${ifDefined(settings.previewWidth)}"
                        height="${ifDefined(settings.previewHeight)}"
                        loading="${ifDefined(active !== i ? 'lazy' : null)}"
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
                        ?checked="${active === i}"
                        @input="${(e: InputEvent) =>
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
