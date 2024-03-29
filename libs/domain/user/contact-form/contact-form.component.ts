import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { FormMixin, FormRenderer, formStyles } from '@spryker-oryx/form';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { fields } from './contact-form.model';
import { styles } from './contact-form.styles';

@hydrate({ event: ['mouseover', 'focusin'] })
export class UserContactFormComponent extends FormMixin(
  ContentMixin(LitElement)
) {
  static styles = [formStyles, styles];

  protected fieldRenderer = resolve(FormRenderer);

  protected override render(): TemplateResult {
    return html`<form>
      <oryx-layout
        layout="grid"
        style="--oryx-column-count:2;--column-gap: 20px;"
      >
        ${this.fieldRenderer.buildForm(fields)}
      </oryx-layout>
    </form>`;
  }
}
