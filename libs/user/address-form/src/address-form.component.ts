import { FormRenderer, formStyles } from '@spryker-oryx/form';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { CountryService } from '@spryker-oryx/site';
import { AddressFormService, AddressService } from '@spryker-oryx/user';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject, combineLatest, map, of, switchMap } from 'rxjs';
import { styles } from './address-form.styles';

@hydratable(['mouseover', 'focusin'])
export class AddressFormComponent extends LitElement {
  static styles = [styles, formStyles];

  @property() country?: string;

  protected fieldRenderer = resolve(FormRenderer);
  protected countryService = resolve(CountryService);
  protected formService = resolve(AddressFormService);
  protected addressService = resolve(AddressService);

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
        ? this.formService
            .getForm({ country })
            .pipe(map((form) => form?.data?.options))
        : of([])
    )
  );

  protected override render(): TemplateResult {
    return html`${asyncValue(this.data$, ([countries, currentCountry]) => {
      return html`<form>
        ${countries.length > 1
          ? html`<oryx-select class="w100" label="Country *">
              <select
                name="country"
                .value=${currentCountry}
                @change=${this.onCountryChange}
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
        ${asyncValue(
          this.form$,
          (form) => html` ${this.fieldRenderer.buildForm(form)}`
        )}
        <oryx-button>
          <button type="submit">Submit</button>
        </oryx-button>
      </form>`;
    })}`;
  }

  protected onCountryChange(e: Event): void {
    const select = e.target as HTMLSelectElement;
    this.country = select.options[select.selectedIndex].value;
    this.countryService.set(this.country);
  }
}
