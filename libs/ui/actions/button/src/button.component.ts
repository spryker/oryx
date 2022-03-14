import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Icons } from '../../../icon';
import { ButtonController } from './button.controller';
import { ButtonSize, ButtonType } from './button.model';
import { buttonStyles } from './button.styles';

export class ButtonComponent extends LitElement {
  static styles = [buttonStyles];

  @property({ type: String, reflect: true }) size?: ButtonSize;
  @property({ type: String, reflect: true }) type?: ButtonType;
  @property({ type: Boolean, reflect: true }) loading?: boolean;
  @property({ type: Boolean, reflect: true }) outline?: boolean;
  @property({ type: Object }) icon?: Icons;

  protected buttonController = new ButtonController(this);

  protected override render(): TemplateResult {
    return html`${when(
        this.icon,
        () => html`<oryx-icon .type=${this.icon}></oryx-icon>`
      )}
      <slot></slot>
      ${when(
        this.loading,
        () => html`<oryx-icon class="loader" type="loader"></oryx-icon>`
      )}`;
  }
}
