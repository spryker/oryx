import { hydrate } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { AffixController, AffixOptions } from './affix';
import { ErrorOptions } from './error';
import { FormControlController, FormControlOptions } from './form-control';
import { baseStyles } from './input.styles';

@hydrate()
export class InputComponent
  extends LitElement
  implements FormControlOptions, AffixOptions, ErrorOptions
{
  static styles = baseStyles;

  @property({ type: Boolean, reflect: true }) floatLabel?: boolean;
  @property() label?: string;
  @property() errorMessage?: string;
  @property({ type: Boolean, reflect: true }) hasError?: boolean;
  @property() prefixIcon?: string;
  @property({ type: Boolean, reflect: true }) prefixFill?: boolean;
  @property() suffixIcon?: string;
  @property({ type: Boolean, reflect: true }) suffixFill?: boolean;

  protected formControlController = new FormControlController(this);
  protected affixController = new AffixController(this);

  protected render(): TemplateResult {
    return html`${this.formControlController.render({
      before: this.affixController.renderPrefix(),
      after: this.affixController.renderSuffix(),
    })}`;
  }
}
