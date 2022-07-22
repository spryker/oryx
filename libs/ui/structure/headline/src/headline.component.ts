import { html, LitElement, TemplateResult } from 'lit';
import { headlineStyles } from './headline.styles';

export const TAG_NAME = 'oryx-headline';

export class HeadlineComponent extends LitElement {
  static styles = headlineStyles;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
