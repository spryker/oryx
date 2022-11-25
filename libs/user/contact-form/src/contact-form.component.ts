import {
  FormComponentMixin,
  FormRenderer,
  formStyles,
} from '@spryker-oryx/form';
import { resolve } from '@spryker-oryx/injector';
import { hydratable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { fields } from './contact-form.model';
import { styles } from './contact-form.styles';

@hydratable(['mouseover', 'focusin'])
export class ContactFormComponent extends FormComponentMixin() {
  static styles = [formStyles, styles];

  protected fieldRenderer = resolve(FormRenderer);

  protected override render(): TemplateResult {
    return html`<form>${this.fieldRenderer.buildForm(fields)}</form>`;
  }
}
