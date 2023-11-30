import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { FormRenderer } from '@spryker-oryx/form';
import {
  CurrencyService,
  PriceModeService,
  PriceModes,
} from '@spryker-oryx/site';
import { I18nTranslationValue, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styles } from './cart-edit.styles';

export class CartEditComponent extends ContentMixin(LitElement) {
  static styles = styles;

  @state() isLoading = false;

  @query('form') form?: HTMLFormElement;

  @query('input[name=cartName]') cartName?: HTMLInputElement;
  @query('select[name=currency]') currency?: HTMLSelectElement;
  @query('select[name=priceMode]') priceMode?: HTMLSelectElement;

  protected fieldRenderer = resolve(FormRenderer);
  protected $currencyService = resolve(CurrencyService);
  protected priceModeService = resolve(PriceModeService);

  protected $currencies = signal(this.$currencyService.getAll(), {
    initialValue: [],
  });
  protected $currentCurrency = signal(this.$currencyService.get());
  protected $currentPriceMode = signal(this.priceModeService.get());

  protected priceModes: string[] = [PriceModes.GrossMode, PriceModes.NetMode];

  protected override render(): TemplateResult | void {
    return html`
      <oryx-heading tag="h1" as="h3">
        ${this.i18n('card-edit.create-cart')}
      </oryx-heading>
      <p>
        ${this.i18n(
          'card-edit.you-can-create-multiple-carts-to-organize-your-running-orders'
        )}
      </p>
      <form @submit=${this.onSubmit}>
        <oryx-input label="${this.i18n('card-edit.name')}">
          <input
            name="cartName"
            required
            placeholder=" ${this.i18n(
              'card-edit.the-name-of-the-shopping-cart'
            )}"
          />
        </oryx-input>
        <oryx-select label="${this.i18n('card-edit.currency')}">
          <select name="currency" required>
            ${repeat(
              this.$currencies(),
              (currency) => currency.code,
              (currency) =>
                html`
                  <option
                    value="${currency.code}"
                    ?selected=${currency.code === this.$currentCurrency()}
                  >
                    ${currency.name}
                  </option>
                `
            )}
          </select>
        </oryx-select>
        <oryx-select label="${this.i18n('card-edit.price-mode')}">
          <select name="priceMode" required>
            ${repeat(
              this.priceModes,
              (priceMode) => priceMode,
              (priceMode) => html`
                <option
                  value="${priceMode}"
                  ?selected=${priceMode === this.$currentPriceMode()}
                >
                  ${this.getLabel(priceMode)}
                </option>
              `
            )}
          </select>
        </oryx-select>

        <oryx-button ?loading=${this.isLoading} @click=${this.onSubmit}
          >${this.i18n('card-edit.create')}</oryx-button
        >
      </form>
    `;
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (this.validateForm()) {
      console.log(
        'form submitted',
        this.currency?.value,
        this.cartName?.value,
        this.priceMode?.value
      );
      // ToDo: Connect with service to create new cart
      // this.createCart();
    }
  }

  protected validateForm(): boolean {
    return !!this.form?.checkValidity();
  }

  protected getLabel(priceMode: string): I18nTranslationValue {
    return this.i18n('site.price-mode.<mode>', {
      mode: priceMode.replace('_', ' '),
    });
  }
}
