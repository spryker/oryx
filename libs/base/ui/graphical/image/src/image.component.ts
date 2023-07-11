import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  computed,
  graphicInjectable,
  hydratable,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ImageComponentAttributes, LoadingStrategy } from './image.model';
import { styles } from './image.styles';

@signalAware()
@hydratable()
export class ImageComponent
  extends LitElement
  implements ImageComponentAttributes
{
  static styles = styles;

  constructor(protected graphicResolver = graphicInjectable.get()) {
    super();
  }

  @signalProperty() resource?: string;

  @property() src?: string;
  @property() srcset?: string;
  @property() alt?: string;
  @property() loading?: LoadingStrategy;
  @property({ type: Boolean }) skipFallback?: boolean;

  @state() failed?: string;

  protected source = computed(() =>
    this.graphicResolver?.getSource(this.resource ?? '')
  );

  protected url = computed(() =>
    this.graphicResolver?.getUrl(this.resource ?? '')
  );

  protected override render(): TemplateResult | void {
    if (this.hasFailure()) return this.renderFallback();

    return html`<slot>${this.renderImage()}</slot>`;
  }

  protected renderImage(): TemplateResult | void {
    if (this.resource) {
      const sourceResult = this.source();

      if (sourceResult) return html`${sourceResult}`;
    }

    const src = this.resource ? this.url() : this.src;

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
    return html`<oryx-icon
      type=${IconTypes.Image}
      part="fallback"
    ></oryx-icon>`;
  }

  protected hasFailure(): boolean {
    return !!this.src && this.failed === this.src;
  }

  protected onError(): void {
    this.failed = this.src;
  }
}
