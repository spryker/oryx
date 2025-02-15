import { ErrorController, ErrorOptions } from '@spryker-oryx/ui/input';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { styles } from './toggle.styles';

export class ToggleComponent extends LitElement implements ErrorOptions {
  static styles = styles;

  protected errorController = new ErrorController(this);

  @property() errorMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;

  protected override render(): TemplateResult {
    return html`
      <label>
        <slot><input type="checkbox" /></slot>
      </label>
      ${this.errorController.render()}
    `;
  }
}
