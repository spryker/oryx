import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
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
  @property({ type: Boolean }) nonTabbable?: boolean;

  protected override render(): TemplateResult {
    return html`
      <details ?open=${this.open}>
        <summary
          part="heading"
          tabindex=${ifDefined(this.preventKeyboardNavigation ? '-1' : undefined)}
        >
          <slot name="header">${this.header}</slot>
          ${this.renderToggleControl()}
          <slot name="aside"></slot>
        </summary>
        <slot part="content"></slot>
      </details>
    `;
  }

  protected renderToggleControl(): TemplateResult {
    return html`
      <oryx-icon-button
        type=${ifDefined(this.isTextTrigger ? 'text' : undefined)}
        size=${this.controlSize}
      >
        <span tabindex=${ifDefined(this.preventKeyboardNavigation ? '0' : undefined)}>
          <slot name="collapsed">
            ${when(
              !this.isTextTrigger,
              () => html`<oryx-icon type="expand"></oryx-icon>`,
              () => html`Hide`
            )}
          </slot>
          <slot name="expanded">
            ${when(
              !this.isTextTrigger,
              () => html`<oryx-icon type="collapse"></oryx-icon>`,
              () => html`Show`
            )}
          </slot>
        </span>
      </oryx-icon-button>
    `
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

  protected get isTextTrigger(): boolean {
    return this.toggleControlType === CollapsibleToggleControlType.TextButton;
  }

  protected get preventKeyboardNavigation(): boolean {
    return this.nonTabbable || this.isInline;
  }
}
