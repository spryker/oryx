import { resolve } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { pickingListsHeaderComponentStyles } from './picking-lists-header.styles';

export class PickingListsHeaderComponent extends I18nMixin(LitElement) {
  static styles = pickingListsHeaderComponentStyles;

  protected localeService = resolve(LocaleService);

  protected $date = signal(this.localeService.formatDate(Date.now()));

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
    console.log(this.$date(), 'date', Date.now());

    return html`
      <oryx-header>
        <div>
          <oryx-heading>
            <h4>
              ${this.i18n('picking.header.pick-lists-<date>', {
                date: this.$date(),
              })}
            </h4>
          </oryx-heading>

          <oryx-search
            backIcon=${IconTypes.Back}
            xs-floated
            @oryx.open=${(): void => this.onToggleSearch(true)}
            @oryx.close=${(): void => this.onToggleSearch(false)}
          >
            <input
              .placeholder=${this.i18n('picking.header.order-ID')}
              @input=${this.onSearch}
            />
          </oryx-search>
        </div>
      </oryx-header>
    `;
  }
}
