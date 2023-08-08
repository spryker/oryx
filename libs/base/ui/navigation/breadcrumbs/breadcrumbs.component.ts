import { html, LitElement, TemplateResult } from 'lit';
import { breadcrumbsStyles } from './breadcrumbs.styles';

/**
 * The `oryx-breadcrumbs` component is designed to build a simple navigation based on breadcrumbs links
 * that can be optionally separated by any divider
 *
 * Navigation links based on anchor elements `<a>` also have additional styling for the hovered state
 *
 * The last element in the list, be it a text element or a link, becomes inactive and styled appropriately
 *
 * Expected template structures:
 *
 * - With icon divider
 *   <oryx-breadcrumbs>
 *     <a href="`href`">text</a>
 *     <oryx-icon type="`type`"></oryx-icon
 *     <a href="`href`">text</a>
 *   <oryx-breadcrumbs>
 *
 * - With text divider
 *   <oryx-breadcrumbs>
 *     <a href="`href`">text</a>
 *     <span>\</span>
 *     <a href="`href`">text</a>
 *   <oryx-breadcrumbs>
 *
 * - Without divider
 *   <oryx-breadcrumbs>
 *     <a href="`href`">text</a>
 *     <a href="`href`">text</a>
 *     <a href="`href`">text</a>
 *   <oryx-breadcrumbs>
 */

export class BreadcrumbsComponent extends LitElement {
  static styles = breadcrumbsStyles;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
