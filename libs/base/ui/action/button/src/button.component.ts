import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { Size } from '../../../src/utilities';
import { ButtonComponentAttributes, ButtonType } from './button.model';
import { buttonStyles } from './styles';

@hydratable()
export class ButtonComponent
  extends LitElement
  implements ButtonComponentAttributes
{
  static styles = buttonStyles;

  @property({ reflect: true }) size?: Size;
  @property({ reflect: true }) type?: ButtonType;
  @property({ type: Boolean, reflect: true }) loading?: boolean;
  @property({ type: Boolean, reflect: true }) confirmed?: boolean;
  @property({ type: Boolean, reflect: true }) outline?: boolean;

  protected override render(): TemplateResult {
    return html`<slot ?inert=${this.loading}></slot>`;
  }
}
