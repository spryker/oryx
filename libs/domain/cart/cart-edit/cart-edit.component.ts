import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { FormMixin, FormRenderer } from '@spryker-oryx/form';
import {
  CurrencyService,
  PriceModeService,
  PriceModes,
} from '@spryker-oryx/site';
import { I18nTranslationValue, computed, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styles } from './cart-edit.styles';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { fields, priceModes } from './cart-edit.model';

export class CartEditComponent extends FormMixin(ContentMixin(LitElement)) {
  static styles = styles;

  protected fieldRenderer = resolve(FormRenderer);

  protected $currencyService = resolve(CurrencyService);

  protected $currencies = signal(this.$currencyService.getAll(), {
    initialValue: [],
  });
  protected $currencyOptions = computed(() => {
    return this.$currencies().map((currency) => ({
      value: currency.code,
      text: currency.name,
    }));
  });

  protected $fields = computed(() => {
    const priceModeOptions = priceModes.map((priceMode) => ({
      value: priceMode,
      text: this.i18n('cart.mode.<mode>', {
        mode: priceMode.split('_')[0].toLowerCase(),
      })
    }));
    return fields(this.i18n, this.$currencyOptions(), priceModeOptions);
  });

  protected override render(): TemplateResult {
    const fields = this.$fields();

    return html`<form @submit=${this.onSubmit}>
      <oryx-layout
        layout="grid"
        style="--oryx-column-count:2;--column-gap: 20px;"
      >
        ${this.fieldRenderer.buildForm(fields)}
      </oryx-layout>

      <oryx-button @click=${() => this.submit()}>${this.i18n('create')}</oryx-button>
    </form>`;
  }

  protected onSubmit(e: SubmitEvent): void {
    e.preventDefault();

   console.log(e);
  }
}


// import { resolve } from '@spryker-oryx/di';
// import { ContentMixin } from '@spryker-oryx/experience';
// import { FormMixin, FormRenderer } from '@spryker-oryx/form';
// import {
//   CurrencyService,
//   PriceModeService,
//   PriceModes,
// } from '@spryker-oryx/site';
// import { I18nTranslationValue, signal } from '@spryker-oryx/utilities';
// import { LitElement, TemplateResult, html } from 'lit';
// import { query, state } from 'lit/decorators.js';
// import { repeat } from 'lit/directives/repeat.js';
// import { styles } from './cart-edit.styles';
// import { HeadingTag } from '@spryker-oryx/ui/heading';

// export class CartEditComponent extends FormMixin(ContentMixin(LitElement)) {
//   static styles = styles;

//   @state() isLoading = false;

//   @query('form') form?: HTMLFormElement;

//   @query('input[name=cartName]') cartName?: HTMLInputElement;
//   @query('select[name=currency]') currency?: HTMLSelectElement;
//   @query('select[name=priceMode]') priceMode?: HTMLSelectElement;

//   protected fieldRenderer = resolve(FormRenderer);
//   protected $currencyService = resolve(CurrencyService);
//   protected priceModeService = resolve(PriceModeService);

//   protected $currencies = signal(this.$currencyService.getAll(), {
//     initialValue: [],
//   });
//   protected $currentCurrency = signal(this.$currencyService.get());
//   protected $currentPriceMode = signal(this.priceModeService.get());

//   protected priceModes: string[] = [PriceModes.GrossMode, PriceModes.NetMode];

//   protected override render(): TemplateResult | void {
//     return html`
//       <oryx-heading tag="${HeadingTag.H1}" typography="${HeadingTag.H3}">
//         ${this.i18n('cart.edit.create-cart')}
//       </oryx-heading>
//       <p>
//         ${this.i18n(
//           'card.edit.note'
//         )}
//       </p>
//       <form @submit=${this.onSubmit}>
//         <oryx-input label="${this.i18n('cart.edit.name')}">
//           <input
//             name="name"
//             required
//             placeholder="${this.i18n('cart.edit.name.placeholder')}"
//           />
//         </oryx-input>
//         <oryx-select label="${this.i18n('currency')}">
//           <select name="currency" required>
//             ${repeat(
//               this.$currencies(),
//               (currency) => currency.code,
//               (currency) =>
//                 html`
//                   <option
//                     value="${currency.code}"
//                     ?selected=${currency.code === this.$currentCurrency()}
//                   >
//                     ${currency.name}
//                   </option>
//                 `
//             )}
//           </select>
//         </oryx-select>
//         <oryx-select label="${this.i18n('card-edit.price-mode')}">
//           <select name="priceMode" required>
//             ${repeat(
//               this.priceModes,
//               (priceMode) => priceMode,
//               (priceMode) => html`
//                 <option
//                   value="${priceMode}"
//                   ?selected=${priceMode === this.$currentPriceMode()}
//                 >
//                   ${this.getLabel(priceMode)}
//                 </option>
//               `
//             )}
//           </select>
//         </oryx-select>

//         <oryx-button ?loading=${this.isLoading} @click=${this.onSubmit}
//           >${this.i18n('create')}</oryx-button
//         >
//       </form>
//     `;
//   }

//   protected onSubmit(event: Event): void {
//     event.preventDefault();

//     if (this.validateForm()) {
//       console.log(
//         'form submitted',
//         this.currency?.value,
//         this.cartName?.value,
//         this.priceMode?.value
//       );
//       // ToDo: Connect with service to create new cart
//       // this.createCart();
//     }
//   }

//   protected validateForm(): boolean {
//     return !!this.form?.checkValidity();
//   }

//   protected getLabel(priceMode: string): I18nTranslationValue {
//     return this.i18n('site.price-mode.<mode>', {
//       mode: priceMode.replace('_', ' '),
//     });
//   }
// }
