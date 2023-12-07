import { CartComponentMixin } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { FormMixin, FormRenderer, FormValues } from '@spryker-oryx/form';
import {
  CurrencyService,
  PriceModeService,
  StoreService,
} from '@spryker-oryx/site';
import { computed, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { CartEditComponentOptions, fields, priceModes } from './edit.model';

@defaultOptions({ isDefault: true })
export class CartEditComponent extends CartComponentMixin(
  FormMixin(ContentMixin<CartEditComponentOptions>(LitElement))
) {
  protected fieldRenderer = resolve(FormRenderer);

  protected $cartValues = computed(() => {
    const cart = this.$cart();

    return cart
      ? {
          name: cart.name,
          isDefault: cart.isDefault,
          priceMode: cart.priceMode,
          currency: cart.currency,
          store: cart.store,
        }
      : {};
  });

  protected currencyService = resolve(CurrencyService);
  protected $currency = signal(this.currencyService.get());
  protected $currencies = signal(this.currencyService.getAll(), {
    initialValue: [],
  });
  protected $currencyOptions = computed(() => {
    return this.$currencies().map((currency) => ({
      value: currency.code,
      text: currency.name,
    }));
  });

  protected priceModeService = resolve(PriceModeService);
  protected $priceMode = signal(this.priceModeService.get());

  protected storeService = resolve(StoreService);
  protected $store = signal(this.storeService.get());

  protected $fields = computed(() => {
    const priceModeOptions = priceModes.map((priceMode) => ({
      value: priceMode,
      text: this.i18n('cart.mode.<mode>', {
        mode: priceMode.split('_')[0].toLowerCase(),
      }),
    }));
    return fields(this.i18n, this.$currencyOptions(), priceModeOptions);
  });

  protected $values = computed(() => {
    const { isDefault } = this.$options();
    return {
      store: this.$store(),
      priceMode: this.$priceMode(),
      currency: this.$currency(),
      isDefault,
      //TODO: uncomment and add additional check for edit cart mode
      // ...this.$cartValues(),
    } as unknown as FormValues;
  });

  protected override render(): TemplateResult {
    const fields = this.$fields();
    const values = this.$values();

    return html`<form @submit=${this.onSubmit}>
      <oryx-layout
        layout="grid"
        style="--oryx-column-count:2;--column-gap: 20px;"
      >
        ${this.fieldRenderer.buildForm(fields, values)}

        <oryx-button @click=${() => this.submit()}
          >${this.i18n('create')}</oryx-button
        >
      </oryx-layout>
    </form>`;
  }

  protected onSubmit(e: SubmitEvent): void {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const cart = Object.fromEntries(new FormData(form).entries());
    cart.store = this.$store()!.id;

    //TODO: replace with cart create service call
    //implemented in list story
    console.log(cart);
  }
}
