import { html, LitElement, TemplateResult } from 'lit';
import { breadcrumbsStyles } from './breadcrumbs.styles';

export class BreadcrumbsComponent extends LitElement {
  static styles = breadcrumbsStyles;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
