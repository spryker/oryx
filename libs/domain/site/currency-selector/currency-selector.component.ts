import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import { CurrencyService } from '@spryker-oryx/site';
import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydratable, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { html } from 'lit/static-html.js';
import { siteCurrencySelectorStyles } from './currency-selector.styles';

@hydratable({ event: ['mouseover', 'focusin'] })
export class SiteCurrencySelectorComponent extends ContentMixin(LitElement) {
  static styles = [siteCurrencySelectorStyles];

  protected $currencyService = resolve(CurrencyService);

  protected $currencies = signal(this.$currencyService.getAll(), {
    initialValue: [],
  });
  protected $current = signal(this.$currencyService.get());
  protected $currentLocale = signal(resolve(LocaleService).get(), {
    initialValue: 'en',
  });

  protected override render(): TemplateResult | void {
    const currencies = this.$currencies();

    if (!this.$current() || !currencies?.length || currencies.length < 2) {
      return;
    }

    return html`
      <oryx-dropdown vertical-align position="start">
        <oryx-button type=${ButtonType.Text} slot="trigger">
          <button>
            ${this.$current()}
            <oryx-icon .type=${IconTypes.Dropdown}></oryx-icon>
          </button>
        </oryx-button>
        ${repeat(
          this.$currencies(),
          (currency) => currency.code,
          (currency) =>
            html` <oryx-option
              close-popover
              value=${currency.code}
              ?active=${currency.code === this.$current()}
              @click=${() => this.onClick(currency.code)}
            >
              ${this.getLabel(currency.code)}
            </oryx-option>`
        )}
      </oryx-dropdown>
    `;
  }

  protected onClick(locale: string): void {
    this.$currencyService.set(locale);
  }

  protected getLabel(code: string): string {
    const currencyNames = new Intl.DisplayNames([this.$currentLocale()], {
      type: 'currency',
    });
    return currencyNames.of(code) ?? code;
  }
}
