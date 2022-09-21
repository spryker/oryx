import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import {
  CollapsibleAppearance,
  CollapsibleProps,
  CollapsibleToggleControlType,
} from './collapsible.model';
import { collapsibleBaseStyle } from './styles';

export class CollapsibleComponent
  extends LitElement
  implements CollapsibleProps
{
  static styles = [collapsibleBaseStyle];

  @property({ reflect: true }) appearance = CollapsibleAppearance.Block;
  @property({ type: Object }) toggleControlType =
    CollapsibleToggleControlType.IconButton;
  @property({ type: Boolean }) open?: boolean;
  @property() header?: string;

  protected override render(): TemplateResult {
    return html`
      <details ?open=${this.open}>
        <summary tabindex=${this.isInline ? -1 : 0}>
          <slot name="header">${this.header}</slot>
          <nav>${this.renderToggleControl()}</nav>
          <slot name="aside"></slot>
        </summary>
        <slot></slot>
      </details>
    `;
  }

  protected renderToggleControl(): TemplateResult {
    return html`
      ${when(
        this.toggleControlType !== CollapsibleToggleControlType.TextButton,
        () => html`
          <oryx-icon-button size=${this.controlSize}>
            <span tabindex=${this.isInline ? 0 : -1}>
              <slot name="collapsed">
                <oryx-icon type="expand"></oryx-icon>
              </slot>
              <slot name="expanded">
                <oryx-icon type="collapse"></oryx-icon>
              </slot>
            </span>
          </oryx-icon-button>
        `
      )}
      ${when(
        this.toggleControlType === CollapsibleToggleControlType.TextButton,
        () => html`
          <oryx-button type="text" size=${this.controlSize}>
            <span tabindex=${this.isInline ? 0 : -1}>
              <slot name="collapsed"> Hide </slot>
              <slot name="expanded"> Show </slot>
            </span>
          </oryx-button>
        `
      )}
    `;
  }

  /**
   * returns the size of the control based on the appearance of the component.
   */
  protected get controlSize(): 'small' | 'medium' | 'large' {
    return this.isInline ? 'small' : 'medium';
  }

  protected get isInline(): boolean {
    return this.appearance === CollapsibleAppearance.Inline;
  }
}
