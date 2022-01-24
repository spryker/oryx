import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Constructor } from '../../../utilities/model';
import { FormControlInterface } from '../form-control/form-control.model';
import { LabelInterface } from './label.model';

export const LabelMixin = <T extends Constructor<LitElement>>(
  superClass: T
): Constructor<LabelInterface> & T => {
  class FormLabelClass extends superClass {
    @property()
    label?: string;

    @state()
    protected isRequired?: boolean;

    protected renderLabel(): TemplateResult {
      return this.label
        ? html`<label>
            ${this.label}${when(this.isRequired, () => html`<sup>*</sup>`)}
          </label>`
        : html``;
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
      super.firstUpdated(_changedProperties);
      const formControlController = (this as unknown as FormControlInterface)
        .formControlController;
      if (!formControlController) {
        return;
      }
      this.isRequired = formControlController.control?.required;
      formControlController.registerListener(
        { attributes: ['required'] },
        () => {
          this.isRequired = formControlController.control?.required;
          this.performUpdate();
        }
      );
    }
  }

  return FormLabelClass as unknown as Constructor<LabelInterface> & T;
};
