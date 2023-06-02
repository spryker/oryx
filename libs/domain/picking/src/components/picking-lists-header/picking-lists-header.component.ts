import { resolve } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { asyncState, i18n, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { pickingListsHeaderComponentStyles } from './picking-lists-header.styles';

export class PickingListsHeaderComponent extends LitElement {
  static styles = pickingListsHeaderComponentStyles;

  protected localeService = resolve(LocaleService);

  @asyncState()
  protected date = valueType(this.localeService.formatDate(Date.now()));

  protected onSearch(e: KeyboardEvent): void {
    const value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(
      new CustomEvent('oryx.search', {
        detail: {
          search: value,
          open: true,
        },
      })
    );
  }

  protected onToggleSearch(open: boolean): void {
    this.dispatchEvent(
      new CustomEvent('oryx.search', {
        detail: {
          search: '',
          open,
        },
      })
    );
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-heading>
        <h4>
          ${i18n('picking.header.pick-lists-<date>', { date: this.date })}
        </h4>
      </oryx-heading>

      <oryx-search
        backIcon=${IconTypes.Back}
        xs-floated
        @oryx.open=${(): void => this.onToggleSearch(true)}
        @oryx.close=${(): void => this.onToggleSearch(false)}
      >
        <input
          .placeholder=${i18n('picking.header.order-ID')}
          @input=${this.onSearch}
        />
      </oryx-search>

      <oryx-site-navigation-item
        uid="user-profile"
        .options=${{
          icon: IconTypes.Profile,
          triggerType: 'icon',
          contentBehavior: 'modal',
          fullscreen: true,
          label: i18n('oryx.picking.account'),
        }}
      ></oryx-site-navigation-item>
    `;
  }
}
