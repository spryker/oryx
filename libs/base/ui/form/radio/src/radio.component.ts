import { CheckedController } from '@spryker-oryx/ui/controller';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ErrorController, ErrorOptions, errorStyles } from '../../input';
import { groupItemStyles } from '../../styles/group-item.styles';
import { baseStyles } from './radio.styles';

export class RadioComponent extends LitElement implements ErrorOptions {
  static styles = [baseStyles, errorStyles, groupItemStyles];

  protected errorController = new ErrorController(this);
  protected checkedController = new CheckedController(this);

  @property() errorMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;

  protected render(): TemplateResult {
    return html`
      <label>
        <slot @slotchange=${this.checkedController.onSlotChange}></slot>
        <slot name="subtext"></slot>
      </label>
      ${this.errorController.render()}
    `;
  }
}
