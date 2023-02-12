import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  FormFieldDefinition,
  FormMixin,
  FormRenderer,
  formStyles,
  FormValues,
} from '@spryker-oryx/form';
import { CountryService } from '@spryker-oryx/site';
import { AddressFormService, AddressService } from '@spryker-oryx/user';
import {
  asyncState,
  hydratable,
  i18n,
  observe,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  AddressFormAttributes,
  AddressFormOptions,
  defaultBillingField,
  defaultShippingField,
} from './address-form.model';
import { styles } from './address-form.styles';

@defaultOptions({ fallbackCountry: 'DE' })
@hydratable(['mouseover', 'focusin'])
export class AddressFormComponent
  extends FormMixin(ContentMixin<AddressFormOptions>(LitElement))
  implements AddressFormAttributes
{
  static styles = [styles, formStyles];

  protected fieldRenderer = resolve(FormRenderer);
  protected countryService = resolve(CountryService);
  protected formService = resolve(AddressFormService);
  protected addressService = resolve(AddressService);
  protected selectRef: Ref<LitElement & HTMLSelectElement> = createRef();

  @property({ type: Boolean }) enableDefaultShipping?: boolean;
  @property({ type: Boolean }) enableDefaultBilling?: boolean;

  @property() country?: string;

  @observe()
  protected country$ = new BehaviorSubject(this.country);

  @property() fallbackCountry?: string;

  @observe()
  protected fallbackCountry$ = new BehaviorSubject(this.fallbackCountry);

  protected activeCountry$ = this.country$.pipe(
    distinctUntilChanged(),
    switchMap((country) =>
      country
        ? of(country)
        : this.countryService.getAll().pipe(
            take(1),
            switchMap((countries) =>
              countries.length === 1
                ? of(countries[0].iso2Code)
                : this.addressService.getCurrentAddress().pipe(
                    take(1),
                    map((address) => {
                      return address?.iso2Code ?? countries[0].iso2Code;
                    })
                  )
            )
          )
    )
  );

  @asyncState()
  protected activeCountry = valueType(this.activeCountry$);

  @asyncState()
  protected countries = valueType(this.countryService.getAll());

  protected form$ = combineLatest([
    this.activeCountry$,
    this.options$,
    this.fallbackCountry$,
  ]).pipe(
    switchMap(([country, options, fallbackCountry]) =>
      country
        ? this.formService
            .getForm({
              country,
              fallbackCountry: fallbackCountry ?? options.fallbackCountry,
            })
            .pipe(
              tap((form) => {
                this.selectRef.value?.setCustomValidity(
                  form ? '' : 'Address form for given country not available.'
                );
              }),
              map((form) => form?.data?.options)
            )
        : of([])
    )
  );

  @asyncState()
  protected form = valueType(this.form$);

  protected onCountryChange(e: Event): void {
    const select = e.target as HTMLSelectElement;
    this.country = select.options[select.selectedIndex].value;
    this.countryService.set(this.country);
  }

  protected processDefaultField(
    field: FormFieldDefinition
  ): FormFieldDefinition {
    return {
      ...field,
      label: i18n(field.label as string) as string,
    };
  }

  protected mergeFields(): FormFieldDefinition[] {
    return [
      ...(this.form ?? []),
      ...(this.enableDefaultShipping
        ? [this.processDefaultField(defaultShippingField)]
        : []),
      ...(this.enableDefaultBilling
        ? [this.processDefaultField(defaultBillingField)]
        : []),
    ];
  }

  protected override render(): TemplateResult {
    const countries = this.countries;

    if (!countries?.length) {
      return html``;
    }

    const activeCountry = this.activeCountry ?? '';
    const form = this.mergeFields();

    return html`<form>
      ${when(
        countries.length > 1,
        () => html` <oryx-select
          class="w100"
          label="Country"
          @oryx.close=${(e: Event): void => e.stopPropagation()}
        >
          <select
            ${ref(this.selectRef)}
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
        </oryx-select>`
      )}
      ${this.fieldRenderer.buildForm(form, this.formValues as FormValues)}
    </form>`;
  }
}
