import { hydratable, resourceInjectable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ImageComponentAttributes, LoadingStrategy } from './image.model';
import { styles } from './image.styles';

@hydratable()
export class ImageComponent
  extends LitElement
  implements ImageComponentAttributes
{
  static styles = styles;

  constructor(protected graphicResolver = resourceInjectable.get()) {
    super();
  }

  @property() src?: string;
  @property() srcset?: string;
  @property() alt?: string;
  @property() resource?: string;
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
    if (this.resource) {
      const source = this.graphicResolver?.getSource(this.resource);

      if (source) {
        return html`${source}`;
      }
    }

    const src = this.resource
      ? this.graphicResolver?.getUrl(this.resource)
      : this.src;

    if (!src) return this.renderFallback();

    return html`
      <img
        src=${src}
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
