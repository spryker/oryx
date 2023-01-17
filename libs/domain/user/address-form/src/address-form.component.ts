import { resolve } from '@spryker-oryx/di';
import {
  FormComponentMixin,
  FormRenderer,
  formStyles,
} from '@spryker-oryx/form';
import { CountryService } from '@spryker-oryx/site';
import { AddressFormService, AddressService } from '@spryker-oryx/user';
import { asyncValue, hydratable, observe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { BehaviorSubject, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { styles } from './address-form.styles';

@hydratable(['mouseover', 'focusin'])
export class AddressFormComponent extends FormComponentMixin() {
  static styles = [styles, formStyles];

  @property() country?: string;

  protected fieldRenderer = resolve(FormRenderer);
  protected countryService = resolve(CountryService);
  protected formService = resolve(AddressFormService);
  protected addressService = resolve(AddressService);
  protected selectRef: Ref<LitElement & HTMLSelectElement> = createRef();

  @observe()
  protected country$ = new BehaviorSubject(this.country);

  protected activeCountry$ = this.country$.pipe(
    switchMap((country) =>
      country
        ? of(country)
        : this.countryService.getAll().pipe(
            switchMap((countries) =>
              countries.length === 1
                ? of(countries[0].iso2Code)
                : this.addressService.getCurrentAddress().pipe(
                    map((address) => {
                      return address?.iso2Code ?? countries[0].iso2Code;
                    })
                  )
            )
          )
    )
  );

  protected data$ = combineLatest([
    this.countryService.getAll(),
    this.activeCountry$,
  ]);

  protected form$ = this.activeCountry$.pipe(
    switchMap((country) =>
      country
        ? this.formService.getForm({ country }).pipe(
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

  protected override render(): TemplateResult {
    return html`<form>
      ${asyncValue(
        this.data$,
        ([countries, currentCountry]) => html`
          ${countries.length > 1
            ? html`<oryx-select class="w100" label="Country">
                <select
                  ${ref(this.selectRef)}
                  name="iso2Code"
                  .value=${currentCountry}
                  @change=${this.onCountryChange}
                  required
                >
                  ${countries.map((country) => {
                    return html`<option
                      value=${country.iso2Code}
                      ?selected=${country.iso2Code === currentCountry}
                    >
                      ${country.name}
                    </option>`;
                  })}
                </select>
              </oryx-select>`
            : html``}
        `
      )}
      ${asyncValue(this.form$, (form) =>
        form ? this.fieldRenderer.buildForm(form) : html``
      )}
    </form>`;
  }

  protected onCountryChange(e: Event): void {
    const select = e.target as HTMLSelectElement;
    this.country = select.options[select.selectedIndex].value;
    this.countryService.set(this.country);
  }
}
