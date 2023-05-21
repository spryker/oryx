import { graphicInjectable, hydratable } from '@spryker-oryx/utilities';
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

  constructor(protected graphicResolver = graphicInjectable.get()) {
    super();
  }

  @property({ reflect: true }) src?: string;
  @property() srcset?: string;
  @property({ reflect: true }) alt?: string;
  @property({ reflect: true }) resource?: string;
  @property() loading?: LoadingStrategy;
  @property({ type: Boolean }) skipFallback?: boolean;

  @state() failed?: string;

  protected override render(): TemplateResult | void {
    if (this.hasFailure()) return this.renderFallback();

    return html`<slot>${this.renderImage()}</slot>`;
  }

  protected renderImage(): TemplateResult | void {
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

  protected renderFallback(): TemplateResult | void {
    if (this.skipFallback) return;
    return html`<oryx-icon type="image" part="fallback"></oryx-icon>`;
  }

  protected hasFailure(): boolean {
    return !!this.src && this.failed === this.src;
  }

  protected onError(): void {
    this.failed = this.src;
  }
}
