import { featureVersion, ssrShim } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, isServer } from 'lit';
import { property, query } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';
import { HeadingAttributes, HeadingTag } from './heading.model';
import { headingStyles } from './heading.styles';
import { TypographyController } from './typography.controller';

@ssrShim('style')
export class HeadingComponent extends LitElement implements HeadingAttributes {
  static styles = headingStyles;

  protected typographyController = new TypographyController(this);

  @query('*') protected content?: HTMLElement;

  @property({ reflect: true }) tag?: HeadingTag;
  @property({ reflect: true }) typography?: HeadingTag;
  @property() lg?: HeadingTag;
  @property() md?: HeadingTag;
  @property() sm?: HeadingTag;

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
    console.log('maxLines', value);
    this._maxLines = value;
    if (featureVersion < '1.4' && value > 0) {
      this.style.setProperty('--max-lines', String(value));
    }
  }

  get maxLines(): number | undefined {
    return this._maxLines;
  }

  protected willUpdate(): void {
    // workaround for SSR, since willUpdate is not available on controller lifecycle
    if (isServer) {
      this.typographyController.hostUpdate();
    }
  }

  protected override render(): TemplateResult {
    return this.renderTag(html`<slot></slot>`);
  }

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
      case HeadingTag.Bold:
      case HeadingTag.Strong:
        return html`<strong>${template}</strong>`;
      case HeadingTag.Caption:
        return html`<caption>
          ${template}
        </caption>`;
      case HeadingTag.Small:
        return html`<small class="caption">${template}</small>`;
      case HeadingTag.Subtitle:
        return html`${template}`;
      default:
        return html`${template}`;
    }
  }
}
