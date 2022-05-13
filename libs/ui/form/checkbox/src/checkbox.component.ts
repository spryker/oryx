import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { CheckboxProperties } from './checkbox.model';
import { checkboxStyles } from './checkbox.styles';
export class CheckboxComponent
  extends LitElement
  implements CheckboxProperties
{
  static styles = checkboxStyles;

  @property({ type: Boolean, reflect: true }) intermediate?: boolean;
  @property({ type: Boolean, reflect: true }) error?: boolean;

  protected override render(): TemplateResult {
    return html`
      <label>
        <slot></slot>
      </label>
      <slot name="error"></slot>
    `;
  }
}
