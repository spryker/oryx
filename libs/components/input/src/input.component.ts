import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../../error-message/src/index';
import { AffixController } from './affix/affix.controller';
import { affixStyles } from './affix/affix.styles';
import { ErrorController } from './error/error.controller';
import { errorStyles } from './error/error.styles';
import { InputController } from './input.controller';
import { inputStyles } from './input.styles';

export class InputComponent extends LitElement {
  static styles = [inputStyles, errorStyles, affixStyles];

  protected inputController = new InputController(this);

  @property() label?: string;

  protected affixController = new AffixController(this);
  @property() prefixIcon?: string;
  @property() suffixIcon?: string;

  protected errorController = new ErrorController(this);
  @property() errorMessage?: string;

  render(): TemplateResult {
    return html`
      ${this.renderLabel()}

      <div class="control">
        ${this.renderPrefix()} ${this.inputController.render()}
        ${this.renderSuffix()}
      </div>

      ${this.errorController.render(this.errorMessage)}
    `;
  }

  protected renderLabel(): TemplateResult {
    return this.label ? html`<label>${this.label}</label>` : html``;
  }

  protected renderPrefix(): TemplateResult {
    return this.affixController.render('prefix', this.prefixIcon);
  }

  protected renderSuffix(): TemplateResult {
    return this.affixController.render('suffix', this.suffixIcon);
  }
}
