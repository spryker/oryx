import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { html, LitElement, TemplateResult } from 'lit';
import { ContentImageContent, ContentImageOptions } from './image.model';
import { contentImageStyles } from './image.styles';
import { ifDefined } from 'lit/directives/if-defined.js';

@defaultOptions({ fit: 'cover' })
export class ContentImageComponent extends ContentMixin<
  ContentImageOptions,
  ContentImageContent
>(LitElement) {
  static styles = [contentImageStyles];

  protected override render(): TemplateResult | void {
    const { image, graphic, link, label, alt } = this.$content();

    if (!image && !graphic) return;

    if (link) {
      return html`<a href=${link} aria-label=${ifDefined(label || alt)}>
        ${this.renderImage()}
      </a>`;
    } else {
      return this.renderImage();
    }
  }

  protected renderImage(): TemplateResult | void {
    const { image, graphic, alt } = this.$content();

    return html`<oryx-image
      resource=${ifDefined(graphic)}
      src=${ifDefined(!graphic ? image : undefined)}
      style=${ifDefined(this.getStyles())}
      alt=${ifDefined(alt)}
    ></oryx-image>`;
  }

  protected getStyles(): string | undefined {
    const { fit, position } = this.$options();
    let styles = '';
    if (fit) styles += `--image-fit:${fit};`;
    if (position) styles += `--image-position:${position};`;
    return styles || undefined;
  }
}
