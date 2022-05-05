import { observe } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject } from 'rxjs';
import { styles } from './image.styles';

interface ProductImage {
  big: string;
  thumb: string;
  alt: string;
}

export class ImageComponent extends LitElement {
  static styles = styles;

  @property()
  protected uid?: string;

  // TODO: Remove default code fallback once product service will be created
  @property()
  protected code = '121';

  @observe()
  protected code$ = new BehaviorSubject(this.code);

  protected productImages: ProductImage[] = [
    {
      big: 'https://images.icecat.biz/img/norm/high/27295368-2600.jpg',
      thumb: 'https://images.icecat.biz/img/norm/medium/27295368-2600.jpg',
      alt: 'pic1',
    },
  ];

  override render(): TemplateResult {
    return html`
      <div class="preview">
        <div class="preview-container">
          ${this.productImages.map(
            // TODO: Active will be changed from thumbs
            (image: ProductImage) => html`
              <picture class="preview-item">
                <img src="${image.big}" alt="${image.alt}" />
              </picture>
            `
          )}
        </div>
      </div>
    `;
  }
}
