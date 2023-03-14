import { Size } from '@spryker-oryx/ui';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import {
  CollapsibleAppearance,
  CollapsibleAttributes,
  CollapsibleToggleControlType,
} from './collapsible.model';
import { collapsibleBaseStyle } from './styles';

export class CollapsibleComponent
  extends LitElement
  implements CollapsibleAttributes
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
          tabindex=${ifDefined(
            this.preventKeyboardNavigation ? '-1' : undefined
          )}
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
    const content = html`
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
    `;

    const trigger = html`
      ${when(
        this.preventKeyboardNavigation,
        () => html`
          <button
            aria-label=${this.open ? 'hide' : 'show'}
            type="button"
            @click=${() => (this.open = !this.open)}
          >
            ${content}
          </button>
        `,
        () => html`<span>${content}</span>`
      )}
    `;

    if (this.isTextTrigger) {
      return html`
        <oryx-button type="text" size=${this.controlSize}>
          ${trigger}
        </oryx-button>
      `;
    }

    return html`
      <oryx-icon-button size=${this.controlSize}> ${trigger} </oryx-icon-button>
    `;
  }

  /**
   * returns the size of the control based on the appearance of the component.
   */
  protected get controlSize(): Size {
    return this.isInline ? Size.Sm : Size.Md;
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
