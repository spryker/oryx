import { I18nMixin } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { styles } from './overview.styles';

export class OverviewComponent extends I18nMixin(LitElement) {
  static styles = styles;

  protected override render(): TemplateResult {
    return html`<oryx-heading
        ><h3>${this.i18n('account.overview')}</h3></oryx-heading
      >
      <div class="content"></div>`;
  }
}
