import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { OryxElement } from '../../utilities';
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

export interface InputOptions extends FormControlOptions, AffixOptions {}

export class InputComponent
  extends LitElement
  implements OryxElement<InputOptions>
{
  static styles = inputStyles;

  @property({ type: Object }) options: InputOptions = {};

  protected formControlController = new FormControlController(this);
  protected affixController = new AffixController(this);

  protected render(): TemplateResult {
    return html`${this.formControlController.render({
      before: this.affixController.renderPrefix(),
      after: this.affixController.renderSuffix(),
    })}`;
  }
}
