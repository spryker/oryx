import { ContextController } from '@spryker-oryx/core';
import { ExperienceService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import {
  BehaviorSubject,
  combineLatest,
  defer,
  map,
  of,
  switchMap,
} from 'rxjs';
import { ProductContext, ProductService } from '../../src';
import {
  ProductImageComponentProperties,
  ProductImageComponentSettings,
  ProductImageNavigationDisplay,
  ProductImagePreviewLayout,
  ProductImageSet,
} from './image.model';
import { styles } from './image.styles';

export class ProductImageComponent extends LitElement {
  static styles = styles;

  @state() active = 0;

  @property({ type: String }) uid?: string;
  @property({ type: String }) code?: string;
  @property({ type: Object }) props: ProductImageComponentProperties = {};

  protected groupName = `product-image-nav-${this.uid}`;

  @observe()
  protected code$ = new BehaviorSubject(this.code);

  @observe()
  protected props$ = new BehaviorSubject(this.props);

  @observe()
  protected active$ = new BehaviorSubject(this.active);

  // TODO: Remove force typing here once resolve starts to return proper type
  protected experienceContent = resolve(
    this,
    ExperienceService,
    null
  ) as ExperienceService | null;

  protected contentResolver$ = defer(() =>
    this.uid && this.experienceContent
      ? this.experienceContent
          .getContent<{ data: ProductImageComponentProperties }>({
            key: this.uid,
          })
          .pipe(switchMap((res) => of(res?.data)))
      : this.props$
  );

  protected productService = resolve(this, ProductService);
  protected context = new ContextController(this);

  protected productCode$ = this.context
    .get(ProductContext.Code, this.code$)
    .pipe(map((code) => code));

  protected productData$ = this.context
    .get(ProductContext.Code, this.code$)
    .pipe(
      switchMap((sku) =>
        this.productService.get({
          sku,
          include: ['abstract-product-image-sets'],
        })
      ),
      map((product) => product?.images ?? [])
    );

  protected setHostAttr(attr: string, val?: string): void {
    if (val) {
      this.setAttribute(attr, val);
      return;
    }

    this.removeAttribute(attr);
  }

  protected productImages$ = combineLatest([
    this.contentResolver$,
    this.active$,
    this.productData$,
  ]).pipe(
    map(([props, active, images]) => {
      const settings: ProductImageComponentSettings = {
        previewWidth: '300',
        previewHeight: '300',
        groupName: this.groupName,
        thumbWidth: '32',
        thumbHeight: '32',
        showPreview: props.previewLayout !== 'none',
        showNavigation:
          props.navigationDisplay !== ProductImageNavigationDisplay.NONE &&
          images.length > 1,
        ...props,
      };

      this.setHostAttr('layout', props.previewLayout);
      this.setHostAttr('nav-position', props.navigationPosition);
      this.setHostAttr('nav-layout', props.navigationLayout);
      this.setHostAttr('nav-display', props.navigationDisplay);
      return {
        settings,
        active,
        images,
      };
    })
  );

  protected setActive(active: number): void {
    this.active = active;
    if (this.props.previewLayout === ProductImagePreviewLayout.TOGGLE) {
      return;
    }
    const items = this.shadowRoot?.querySelectorAll('picture') || [];
    items[active]?.scrollIntoView({ block: 'nearest', inline: 'start' });
  }

  protected onInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    const active = target?.value || 0;
    this.setActive(+active);
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
                        @input="${this.onInput}"
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
