import { CartComponentMixin, CreateCartQualifier, UpdateCartQualifier } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  FormFieldDefinition,
  FormFieldType,
  FormMixin,
  FormRenderer,
  FormValues,
} from '@spryker-oryx/form';
import {
  CurrencyService,
  PriceModeService,
  PriceModes,
  StoreService,
} from '@spryker-oryx/site';
import { computed, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { CartEditComponentOptions } from './edit.model';

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

  protected priceModeService = resolve(PriceModeService);
  protected $priceMode = signal(this.priceModeService.get());

  protected storeService = resolve(StoreService);
  protected $store = signal(this.storeService.get());

  protected getFields(): FormFieldDefinition[] {
    const priceModeOptions = [PriceModes.GrossMode, PriceModes.NetMode].map(
      (priceMode) => ({
        value: priceMode,
        text: this.i18n('cart.mode.<mode>', {
          mode: priceMode.split('_')[0].toLowerCase(),
        }),
      })
    );

    const currencyOptions = this.$currencies().map((currency) => ({
      value: currency.code,
      text: currency.name,
    }));

    return [
      {
        id: 'name',
        type: FormFieldType.Text,
        label: this.i18n('cart.edit.name'),
        placeholder: this.i18n('cart.edit.name.placeholder'),
        required: true,
        width: 100,
      },
      {
        id: 'currency',
        type: FormFieldType.Select,
        label: this.i18n('currency'),
        required: true,
        options: currencyOptions,
      },
      {
        id: 'priceMode',
        type: FormFieldType.Select,
        label: this.i18n('cart.edit.price-mode'),
        required: true,
        options: priceModeOptions,
      },
      {
        id: 'isDefault',
        type: FormFieldType.Boolean,
        label: this.i18n('cart.edit.set-default'),
        width: 100,
      },
    ];
  }

  protected $values = computed<FormValues>(() => {
    return {
      priceMode: this.$priceMode(),
      currency: this.$currency(),
      isDefault: !!this.$options().isDefault,
      //TODO: uncomment and add additional check for edit cart mode
      // ...this.$cartValues(),
    };
  });

  protected override render(): TemplateResult {
    const fields = this.getFields();
    const values = this.$values();

    return html`<form @oryx.submit=${this.onSubmit}>
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

  protected onSubmit(e: CustomEvent<FormValues>): void {
    const form = e.target as HTMLFormElement;

    const values = Object.fromEntries(new FormData(form).entries());
    const data = {
      ...values as CreateCartQualifier,
      store: this.$store()!.id,
      isDefault: values.isDefault
    };
    // const data = 
    // cart.store = this.$store()!.id;
    // cart.isDefault = cart.isDefault === 'true';


    //TODO: replace with cart create service call
    //implemented in list story
    console.log(values);
  }
}
