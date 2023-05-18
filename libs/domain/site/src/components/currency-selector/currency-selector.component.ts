import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import { ButtonType } from '@spryker-oryx/ui/button';
import { hydratable, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { html } from 'lit/static-html.js';
import { CurrencyService } from '../../services';
import { SiteCurrencySelectorOptions } from './currency-selector.model';
import { siteLocaleSelectorStyles } from './currency-selector.styles';

@hydratable(['mouseover', 'focusin'])
export class SiteCurrencySelectorComponent extends ContentMixin<SiteCurrencySelectorOptions>(
  LitElement
) {
  static styles = [siteLocaleSelectorStyles];

  protected currencyService = resolve(CurrencyService);

  protected currencies = signal(this.currencyService.getAll());
  protected current = signal(this.currencyService.get());
  protected currentLocale = signal(resolve(LocaleService).get());

  protected override render(): TemplateResult | void {
    if (
      !this.current() ||
      !this.currencies()?.length ||
      this.currencies().length < 2
    ) {
      return;
    }

    return html`
      <oryx-dropdown vertical-align position="start">
        <oryx-button type=${ButtonType.Text} slot="trigger">
          <button>
            ${this.current()}
            <oryx-icon type="dropdown"></oryx-icon>
          </button>
        </oryx-button>
        ${repeat(
          this.currencies() ?? [],
          (currency) => currency.code,
          (currency) =>
            html` <oryx-option
              close-popover
              value=${currency.code}
              ?active=${currency.code === this.current()}
              @click=${() => this.onClick(currency.code)}
            >
              ${this.getLabel(currency.code)}
            </oryx-option>`
        )}
      </oryx-dropdown>
    `;
  }

  protected onClick(locale: string): void {
    this.currencyService.set(locale);
  }

  protected getLabel(code: string): string {
    const currencyNames = new Intl.DisplayNames(
      [this.currentLocale() ?? 'en'],
      {
        type: 'currency',
      }
    );
    return currencyNames.of(code) ?? code;
  }
}
