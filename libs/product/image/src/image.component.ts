import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { ProductContext, ProductService } from '../../src';
import {
  ProductImage,
  ProductImageComponentProperties,
  ProductImageNavigationDisplay,
  ProductImagePreviewLayout,
} from './image.model';
import { styles } from './image.styles';

export class ProductImageComponent
  extends LitElement
  implements ProductImageComponentProperties
{
  static styles = styles;
  @state() active = 0;

  @property({ type: String }) uid?: string;
  @property({ type: String }) code?: string;
  @property({ type: Object }) props: ProductImageComponentProperties = {};

  @observe()
  protected code$ = new BehaviorSubject(this.code);

  protected productService = resolve(this, ProductService);
  protected context = new ContextController(this);

  protected productCode$ = this.context
    .get(ProductContext.Code, this.code$)
    .pipe(map((code) => code));

  protected productImages$ = this.productCode$.pipe(
    switchMap((sku) =>
      this.productService.get({ sku, include: ['abstract-product-image-sets'] })
    ),
    map((product) => product?.images ?? [])
  );

  protected setActive(active: number): void {
    this.active = active;
    const items = this.shadowRoot?.querySelectorAll('picture') || [];
    items.forEach((item: HTMLElement) => {
      item.classList.remove('active');
    });
    items[active]?.classList.add('active');
    if (this.props.previewLayout === ProductImagePreviewLayout.TOGGLE) {
      return;
    }
    items[active]?.scrollIntoView({ block: 'nearest', inline: 'start' });
  }

  protected shouldDisplayPreview(layout?: string): boolean {
    return layout !== 'none';
  }

  protected shouldDisplayThumbs(
    images: ProductImage[],
    display?: ProductImageNavigationDisplay
  ): boolean {
    return display !== ProductImageNavigationDisplay.NONE && images.length > 1;
  }

  protected onInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    const active = target?.value || 0;
    this.setActive(+active);
  }

  protected setHostAttr(attr: string, val?: string): void {
    if (val) this.setAttribute(attr, val);
    else this.removeAttribute(attr);
  }

  protected override render(): TemplateResult {
    const settings: ProductImageComponentProperties = {
      previewWidth: '300',
      previewHeight: '300',
      name: `nav-${Math.round(Math.random() * 10000)}`,
      thumbWidth: '32',
      thumbHeight: '32',
      ...this.props,
    };

    this.setHostAttr('layout', settings.previewLayout);
    this.setHostAttr('nav-position', settings.thumbPosition);
    this.setHostAttr('nav-layout', settings.thumbLayout);
    this.setHostAttr('nav-display', settings.thumbDisplay);

    return html`
      ${asyncValue(this.productImages$, (images) => {
        return html`
          ${when(
            this.shouldDisplayPreview(settings.previewLayout),
            () => html`
              <section>
                ${images.map(
                  (image, i) => html`
                    <picture
                      class="${ifDefined(this.active === i ? 'active' : null)}"
                    >
                      <img
                        .src="${image.externalUrlLarge}"
                        .alt="image${i + 1}"
                        width="${ifDefined(settings.previewWidth)}"
                        height="${ifDefined(settings.previewHeight)}"
                        loading="${ifDefined(
                          this.active !== i ? 'lazy' : null
                        )}"
                      />
                    </picture>
                  `
                )}
              </section>
            `
          )}
          ${when(
            this.shouldDisplayThumbs(images, settings.thumbDisplay),
            () => html`
              <fieldset class="nav">
                ${images.map(
                  (image: ProductImage, i: number) => html`
                    <label class="nav-item">
                      <input
                        value="${i}"
                        type="radio"
                        name="${ifDefined(settings.name)}"
                        ?checked="${this.active === i}"
                        @input="${this.onInput}"
                      />
                      <img
                        src="${image.externalUrlSmall}"
                        alt="${ifDefined(settings.name)}"
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
