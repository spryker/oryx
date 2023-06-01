import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  FormFieldDefinition,
  FormFieldType,
  FormMixin,
  FormRenderer,
  formStyles,
} from '@spryker-oryx/form';
import { CountryService } from '@spryker-oryx/site';
import {
  Address,
  AddressFormService,
  AddressService,
} from '@spryker-oryx/user';
import {
  computed,
  hydratable,
  i18n,
  signal,
  signalProperty,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import {
  AddressForm,
  AddressFormAttributes,
  AddressFormOptions,
} from './address-form.model';
import { styles } from './address-form.styles';

@defaultOptions({ fallbackCountry: 'DE' })
@hydratable(['mouseover', 'focusin'])
export class AddressFormComponent
  extends FormMixin(ContentMixin<AddressFormOptions>(LitElement))
  implements AddressFormAttributes
{
  static styles = [styles, formStyles];

  protected countryService = resolve(CountryService);
  protected addressService = resolve(AddressService);
  protected addressFormService = resolve(AddressFormService);
  protected fieldRenderer = resolve(FormRenderer);

  @property({ type: Boolean }) enableDefaultShipping?: boolean;
  @property({ type: Boolean }) enableDefaultBilling?: boolean;
  @property({ type: Object }) address?: Address;

  @signalProperty() country?: string;
  @signalProperty() fallbackCountry?: string;

  protected countries = signal(this.countryService.getAll());
  protected currentAddress = signal(this.addressService.getCurrentAddress());
  protected activeCountry = computed(() => {
    if (this.country) return this.country;
    return this.currentAddress()?.iso2Code ?? this.countries()?.[0].iso2Code;
  });

  protected formModel = computed(() => {
    const country = this.activeCountry();
    const fallbackCountry =
      this.fallbackCountry ?? this.$options().fallbackCountry;

    if (!country) return;

    return this.addressFormService.getForm({ country, fallbackCountry });
  });

  @query('form')
  protected form?: HTMLFormElement;

  protected override render(): TemplateResult | void {
    return html`<form @change=${this.onChange}>
      ${this.renderCountrySelector()}
      ${this.fieldRenderer.buildForm(this.getFormFields(), this.values)}
    </form>`;
  }

  protected getFormFields(): FormFieldDefinition[] {
    const form = this.formModel();

    const formFields = (form as unknown as AddressForm)?.data.options ?? [];
    if (this.enableDefaultShipping) {
      formFields.push({
        id: 'isDefaultShipping',
        type: FormFieldType.Boolean,
        label: i18n('form.address.default-delivery-address'),
        width: 100,
      });
    }
    if (this.enableDefaultBilling) {
      formFields.push({
        id: 'isDefaultBilling',
        type: FormFieldType.Boolean,
        label: i18n('form.address.default-billing-address'),
        width: 100,
      });
    }

    return formFields;
  }

  protected renderCountrySelector(): TemplateResult | void {
    const countries = this.countries();
    const activeCountry = this.activeCountry();
    if (!countries?.length || countries?.length < 2) return;

    return html` <oryx-select
      class="w100"
      label="Country"
      @oryx.close=${(e: Event): void => e.stopPropagation()}
    >
      <select
        name="iso2Code"
        .value=${activeCountry}
        required
        @change=${this.onCountryChange}
      >
        ${countries.map((country) => {
          return html`<option
            value=${country.iso2Code}
            ?selected=${country.iso2Code === activeCountry}
          >
            ${country.name}
          </option>`;
        })}
      </select>
    </oryx-select>`;
  }

  protected onCountryChange(e: Event): void {
    const select = e.target as HTMLSelectElement;
    this.country = select.options[select.selectedIndex].value;
    this.countryService.set(this.country);
  }

  protected onChange(): void {
    if (this.form) {
      const data: Address = Object.fromEntries(
        new FormData(this.form).entries()
      );
      this.dispatchEvent(
        new CustomEvent('selectedAddress', {
          detail: { data, valid: this.form.checkValidity() },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}
