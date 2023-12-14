import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { IMAGE_FIT, IMAGE_POSITION } from '@spryker-oryx/ui';
import { featureVersion } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ContentImageContent, ContentImageOptions } from './image.model';
import { contentImageStyles } from './image.styles';

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
    if (featureVersion >= '1.4') return;
    const { fit, position } = this.$options();
    let styles = '';
    if (fit) styles += `${IMAGE_FIT}:${fit};`;
    if (position) styles += `${IMAGE_POSITION}:${position};`;
    return styles || undefined;
  }
}
