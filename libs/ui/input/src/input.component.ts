import { html, LitElement, TemplateResult } from 'lit';
import { AffixMixin, affixStyles } from './affix';
import { ErrorMixin, errorStyles } from './error';
import { FormControlMixin } from './form-control/form-control.mixin';
import { formControlStyles } from './form-control/form-control.styles';
import { LabelMixin, labelStyles } from './label';

export const inputMixin = AffixMixin(
  ErrorMixin(LabelMixin(FormControlMixin(LitElement)))
);
export const inputStyles = [
  formControlStyles,
  labelStyles,
  errorStyles,
  affixStyles,
];
export class InputComponent extends inputMixin {
  static styles = inputStyles;

  protected render(): TemplateResult {
    return html`
      ${this.renderLabel()}
      ${this.formControlController.render(
        this.affixController.renderPrefix(),
        this.affixController.renderSuffix()
      )}
      ${this.renderError()}
    `;
  }
}
