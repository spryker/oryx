import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { AffixController, AffixOptions, affixStyles } from './affix';
import { ErrorOptions, errorStyles } from './error';
import { FormControlController, FormControlOptions } from './form-control';
import { floatingLabelStyles } from './form-control/floating-label.styles';
import { formControlStyles } from './form-control/form-control.styles';

export const inputStyles = [
  formControlStyles,
  floatingLabelStyles,
  errorStyles,
  affixStyles,
];

export class InputComponent
  extends LitElement
  implements FormControlOptions, AffixOptions, ErrorOptions
{
  static styles = inputStyles;

  @property({ type: Boolean }) floatLabel?: boolean;
  @property() label?: string;
  @property() errorMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;
  @property() prefixIcon?: string;
  @property({ type: Boolean }) prefixFill?: boolean;
  @property() suffixIcon?: string;
  @property({ type: Boolean }) suffixFill?: boolean;

  protected formControlController = new FormControlController(this);
  protected affixController = new AffixController(this);

  protected render(): TemplateResult {
    return html`${this.formControlController.render({
      before: this.affixController.renderPrefix(),
      after: this.affixController.renderSuffix(),
    })}`;
  }
}
