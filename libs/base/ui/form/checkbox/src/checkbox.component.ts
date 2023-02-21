import { CheckedController } from '@spryker-oryx/ui/controller';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ErrorController, ErrorOptions } from '../../input';
import { groupItemStyles } from '../../styles/group-item.styles';
import { CheckboxProperties } from './checkbox.model';
import { checkboxStyles } from './checkbox.styles';
export class CheckboxComponent
  extends LitElement
  implements CheckboxProperties, ErrorOptions
{
  static styles = [checkboxStyles, groupItemStyles];

  protected errorController = new ErrorController(this);
  protected checkedController = new CheckedController(this);

  @property({ type: Boolean, reflect: true }) required?: boolean;
  @property({ type: Boolean, reflect: true }) intermediate?: boolean;
  @property() errorMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;

  protected override render(): TemplateResult {
    return html`
      <label>
        <slot @slotchange=${this.checkedController.onSlotChange}></slot>
        <slot name="subtext"></slot>
      </label>
      ${this.errorController.render()}
    `;
  }
}
