import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { CurrencyService } from '@spryker-oryx/site';
import { ButtonType } from '@spryker-oryx/ui/button';
import { asyncState, valueType } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { html } from 'lit/static-html.js';
import { SiteCurrencySelectorOptions } from './currency-selector.model';
import { siteLocaleSelectorStyles } from './currency-selector.styles';

export class SiteCurrencySelectorComponent extends ContentMixin<SiteCurrencySelectorOptions>(
  LitElement
) {
  static styles = [siteLocaleSelectorStyles];

  protected currencyService = resolve(CurrencyService);

  @asyncState()
  protected currencies = valueType(this.currencyService.getAll());

  @asyncState()
  protected current = valueType(this.currencyService.get());

  protected override render(): TemplateResult | void {
    if (!this.current || !this.currencies?.length || this.currencies.length < 2)
      return;
    console.log(this.currencies);
    return html`
      <oryx-dropdown vertical-align position="start">
        <oryx-button type=${ButtonType.Text} slot="trigger">
          <button>
            ${this.current}
            <oryx-icon type="dropdown"></oryx-icon>
          </button>
        </oryx-button>
        ${repeat(
          this.currencies ?? [],
          (locale) => locale.code,
          (locale) =>
            html` <oryx-option
              close-popover
              value=${locale.code}
              ?active=${locale.code === this.current}
              @click=${() => this.onClick(locale.code)}
            >
              ${this.getLabel(locale.code)}
            </oryx-option>`
        )}
      </oryx-dropdown>
    `;
  }

  protected onClick(locale: string): void {
    this.currencyService.set(locale);
  }

  protected getLabel(code: string): string {
    const languageNames = new Intl.DisplayNames([this.current ?? 'en'], {
      type: 'currency',
    });
    return languageNames.of(code) ?? code;
  }
}
