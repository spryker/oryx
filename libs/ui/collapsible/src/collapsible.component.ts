import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { CollapsibleProps } from './collapsible.model';
import { collapsibleBaseStyle, collapsibleStyle } from './styles';

export class CollapsibleComponent
  extends LitElement
  implements CollapsibleProps
{
  static styles = [collapsibleBaseStyle, collapsibleStyle];

  @property({ type: Boolean }) open?: boolean;
  @property() header?: string;

  protected override render(): TemplateResult {
    return html`
      <details ?open=${this.open}>
        <summary>
          <slot name="header">${this.header}</slot>

          <slot name="expand-icon">
            <oryx-icon type="add" size="medium"></oryx-icon>
          </slot>
          <slot name="collapse-icon">
            <oryx-icon type="minus" size="medium"></oryx-icon>
          </slot>
        </summary>
        <slot></slot>
      </details>
    `;
  }
}
