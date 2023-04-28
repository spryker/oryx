import { resolve } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { asyncState, i18n, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './picking-lists-header.styles';

export class PickingListsHeaderComponent extends LitElement {
  static styles = styles;

  protected localeService = resolve(LocaleService);

  @asyncState()
  protected date = valueType(this.localeService.formatDate(Date.now()));

  protected onSearch(e: KeyboardEvent): void {
    const value = (e.target as HTMLInputElement).value;
    console.log(value);
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-heading>
        <h4>${i18n('picking.header.orders-<date>', { date: this.date })}</h4>
      </oryx-heading>

      <oryx-search backIcon="backArrow" xs-floated>
        <input
          .placeholder=${i18n('picking.header.order-ID')}
          @input=${this.onSearch}
        />
      </oryx-search>

      <oryx-site-navigation-item
        uid="user-profile"
        .options=${{
          icon: 'profile',
          triggerType: 'icon',
          contentBehavior: 'modal',
        }}
      ></oryx-site-navigation-item>
    `;
  }
}
