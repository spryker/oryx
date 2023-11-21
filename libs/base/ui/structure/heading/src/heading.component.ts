import { featureVersion, hydrate, ssrShim } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import {
  HeadingAttributes,
  HeadingTag,
  HeadingTypography,
} from './heading.model';
import { headingStyles } from './heading.styles';
import { renderHeading } from './heading.util';

@ssrShim('style')
@hydrate()
export class HeadingComponent extends LitElement implements HeadingAttributes {
  static styles = headingStyles;

  @property({ reflect: true }) tag?: HeadingTypography | HeadingTag;

  @property({ reflect: true }) typography?: HeadingTypography;
  @property({ reflect: true }) lg?: HeadingTypography;
  @property({ reflect: true }) md?: HeadingTypography;
  @property({ reflect: true }) sm?: HeadingTypography;

  @property({ reflect: true }) as?: HeadingTag | 'hide' | 'show';
  @property({ reflect: true, attribute: 'as-lg' }) asLg?:
    | HeadingTag
    | 'hide'
    | 'show';

  @property({ reflect: true, attribute: 'as-md' }) asMd?:
    | HeadingTag
    | 'hide'
    | 'show';

  @property({ reflect: true, attribute: 'as-sm' }) asSm?:
    | HeadingTag
    | 'hide'
    | 'show';

  private _maxLines?: number;
  @property() set maxLines(value: number) {
    this._maxLines = value;
    if (featureVersion < '1.4' && value > 0) {
      this.style.setProperty('--max-lines', String(value));
    }
  }

  protected override render(): TemplateResult {
    return html`${unsafeStatic(
      renderHeading(`<slot></slot>`, {
        tag: this.tag,
        typography: this.typography ?? (this.as as HeadingTypography),
        lg: this.lg ?? (this.asLg as HeadingTypography),
        md: this.md ?? (this.asMd as HeadingTypography),
        sm: this.sm ?? (this.asSm as HeadingTypography),
        maxLines: this._maxLines,
      })
    )}`;
  }

  /**
   * @deprecated use heading directive instead.
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
        return html`<b class="subtitle">${template}</b>`;
      case HeadingTag.Caption:
        return html`<span class="caption">${template}</span>`;
      default:
        return html`${template}`;
    }
  }
}
