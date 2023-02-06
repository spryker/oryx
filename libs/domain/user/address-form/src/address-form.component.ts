import { resolve } from '@spryker-oryx/di';
import { ContentController, defaultOptions } from '@spryker-oryx/experience';
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
import { styles } from './address-form.styles';
import { AddressFormOptions } from './model';

@defaultOptions({ fallbackCountry: 'DE' })
@hydratable(['mouseover', 'focusin'])
export class AddressFormComponent extends FormComponentMixin<AddressFormOptions>() {
  static styles = [styles, formStyles];

  protected options$ = new ContentController(this).getOptions();

  @property() country?: string;
  @property() fallbackCountry?: string;

  protected fieldRenderer = resolve(FormRenderer);
  protected countryService = resolve(CountryService);
  protected formService = resolve(AddressFormService);
  protected addressService = resolve(AddressService);
  protected selectRef: Ref<LitElement & HTMLSelectElement> = createRef();

  @observe()
  protected country$ = new BehaviorSubject(this.country);

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

  protected data$ = combineLatest([
    this.countryService.getAll(),
    this.activeCountry$,
  ]);

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
