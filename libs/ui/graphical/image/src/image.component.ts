import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LoadingStrategy } from './image.model';
import { styles } from './image.styles';

export class ImageComponent extends LitElement {
  static styles = styles;

  @property() src?: string;
  @property() srcset?: string;
  @property() alt?: string;
  @property() loading?: LoadingStrategy;

  @state() failed?: string;

  protected override render(): TemplateResult {
    if (this.hasFailure()) return this.renderFallback();

    return html`<slot>${this.renderImage()}</slot>`;
  }

  protected renderFallback(): TemplateResult {
    return html`<oryx-icon type="image" part="fallback"></oryx-icon>`;
  }

  protected renderImage(): TemplateResult {
    //render() sometimes gets called before receiving correct data
    if (!this.src && this.renderRoot) {
      const element = this.renderRoot.querySelector('img');
      if (element && this.src !== element?.src) {
        this.src = element.src;
        this.srcset = element.srcset;
        this.alt = element.alt;
      }
    }

    if (!this.src) return this.renderFallback();

    return html`
      <img
        src=${ifDefined(this.src)}
        srcset=${ifDefined(this.srcset)}
        alt=${ifDefined(this.alt)}
        loading=${ifDefined(this.loading)}
        @error=${this.onError}
      />
    `;
  }

  protected hasFailure(): boolean {
    return !!this.src && this.failed === this.src;
  }

  protected onError(): void {
    this.failed = this.src;
  }
}
