import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { AffixController, AffixOptions, affixStyles } from './affix';
import { errorStyles } from './error';
import { FormControlController, FormControlOptions } from './form-control';
import { formControlStyles } from './form-control/form-control.styles';
import { labelStyles } from './label';

export const inputStyles = [
  formControlStyles,
  labelStyles,
  errorStyles,
  affixStyles,
];

export class InputComponent
  extends LitElement
  implements FormControlOptions, AffixOptions
{
  static styles = inputStyles;

  @property() label?: string;
  @property() errorMessage?: string;
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
