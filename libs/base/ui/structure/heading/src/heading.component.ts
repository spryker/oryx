import { hydrate, ssrShim } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { HeadingAttributes, HeadingTag } from './heading.model';
import { headlineStyles } from './styles/base.styles';

@ssrShim('style')
@hydrate()
export class HeadingComponent extends LitElement implements HeadingAttributes {
  static styles = headlineStyles;

  @property({ reflect: true }) tag?: HeadingTag;
  @property({ reflect: true }) as?: HeadingTag | 'hide';

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

  @property() set maxLines(value: number) {
    if (value > 0) {
      this.style.setProperty('--max-lines', String(value));
    }
  }

  protected override render(): TemplateResult {
    return html`${this.renderTag(html`<slot></slot>`)}`;
  }

  /**
   * Generates the TAG (h1 - h6 and subtitle) based on the tag.
   *
   * We'd prefer using the `unsafeStatic` directive, however, there's an SSR related
   * issue that blocks us from using this: https://github.com/lit/lit/issues/2246.
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
