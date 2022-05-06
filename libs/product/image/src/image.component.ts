import { observe } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject } from 'rxjs';
import { images } from './image.mock';
import { ImageProperties, ProductImage } from './image.model';
import { styles } from './image.styles';

export class ImageComponent extends LitElement implements ImageProperties {
  static styles = styles;
  @property({ type: String }) uid?: string;

  // TODO: Remove default code fallback once product service will be created
  @property({ type: String }) code = '121';

  @property({ type: Number }) active = 0;

  @property({ type: Boolean }) hideThumbs = false;

  @observe()
  protected code$ = new BehaviorSubject(this.code);

  protected thumbSize = 32;

  protected productImages: ProductImage[] = images;

  protected setActive(i: number): void {
    this.active = i;
    const items = this.shadowRoot?.querySelectorAll('.preview-item');
    items?.[i]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }

  override render(): TemplateResult {
    return html`
      <div class="preview">
        <div class="preview-container">
          ${this.productImages.map(
            (image: ProductImage, i: number) => html`
              <picture
                class="preview-item ${i === this.active ? 'active' : ''}"
              >
                <img src="${image.big}" alt="${image.alt}" />
              </picture>
            `
          )}
        </div>
      </div>
      ${!this.hideThumbs &&
      this.productImages.length > 1 &&
      html`
        <div class="thumbs">
          ${this.productImages.map(
            (image: ProductImage, i: number) => html`
              <button
                type="button"
                class="thumb ${i === this.active ? 'active' : ''}"
                @click=${(): void => this.setActive(i)}
              >
                <img
                  src="${image.thumb}"
                  alt="${image.alt}"
                  width="${this.thumbSize}"
                  height="${this.thumbSize}"
                />
              </button>
            `
          )}
        </div>
      `}
    `;
  }
}
