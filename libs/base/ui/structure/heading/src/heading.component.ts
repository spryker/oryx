import { featureVersion, ssrShim } from '@spryker-oryx/utilities';
import { LitElement, PropertyValueMap, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';
import {
  HeadingAttributes,
  HeadingTag,
  HeadingVisibility,
} from './heading.model';
import { headingStyles } from './heading.styles';
import { headlineStyles } from './styles';
import { TypographyController } from './typography.controller';

@ssrShim('style')
export class HeadingComponent extends LitElement implements HeadingAttributes {
  static styles = featureVersion >= '1.4' ? headingStyles : headlineStyles;

  protected typographyController = new TypographyController(this);

  @property() tag?: HeadingTag;
  @property() typography?: HeadingTag | HeadingVisibility;
  @property() lg?: HeadingTag | HeadingVisibility;
  @property() md?: HeadingTag | HeadingVisibility;
  @property() sm?: HeadingTag | HeadingVisibility;
  @property() maxLines?: number;

  @property({ reflect: true }) as?: HeadingTag;
  @property({ reflect: true, attribute: 'as-lg' }) asLg?:
    | HeadingTag
    | HeadingVisibility;
  @property({ reflect: true, attribute: 'as-md' }) asMd?:
    | HeadingTag
    | HeadingVisibility;
  @property({ reflect: true, attribute: 'as-sm' }) asSm?:
    | HeadingTag
    | HeadingVisibility;

  protected override render(): TemplateResult {
    return this.renderTag(html`<slot></slot>`);
  }

  protected willUpdate(
    properties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.willUpdate(properties);
    // as long as the controller does not support willUpdate on SSR,
    // we need to call this manually.
    this.typographyController.hostUpdate();
  }

  /**
   * Generates the heading element based on the tag property.
   */
  protected renderTag(template: TemplateResult): TemplateResult {
    switch (this.tag) {
      case HeadingTag.H1:
        return html`<h1>${template}</h1>`;
      case HeadingTag.H2:
        return html`<h2>${template}</h2>`;
      case HeadingTag.H3:
        return html`<h3>${template}</h3>`;
      case HeadingTag.H4:
        return html`<h4>${template}</h4>`;
      case HeadingTag.H5:
        return html`<h5>${template}</h5>`;
      case HeadingTag.H6:
        return html`<h6>${template}</h6>`;
      case HeadingTag.Subtitle:
        return featureVersion >= '1.4'
          ? html`${template}`
          : html`<b class="subtitle">${template}</b>`;
      case HeadingTag.Bold:
      case HeadingTag.Strong:
        return html`<strong>${template}</strong>`;
      case HeadingTag.Caption:
        return html`<span class="caption">${template}</span>`;
      case HeadingTag.Small:
        return html`<small>${template}</small>`;
      default:
        return html`${template}`;
    }
  }
}
