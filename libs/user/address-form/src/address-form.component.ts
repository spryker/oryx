import { FormRenderer, formStyles } from '@spryker-oryx/form';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { CountryService } from '@spryker-oryx/site';
import { AddressFormService } from '@spryker-oryx/user';
import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { styles } from './address-form.styles';

@hydratable(['mouseover', 'focusin'])
export class AddressFormComponent extends LitElement {
  static styles = [styles, formStyles];

  @property() country = 'DE';

  @observe()
  protected country$ = new BehaviorSubject(this.country);

  protected fieldRenderer = resolve(FormRenderer);
  protected countryService = resolve(CountryService);
  protected formService = resolve(AddressFormService);

  protected data$ = combineLatest([
    this.countryService.get(),
    this.country$.pipe(
      switchMap((country) => this.formService.getForm({ country }))
    ),
  ]);

  protected override render(): TemplateResult {
    return html`${asyncValue(this.data$, ([countries, data]) => {
      return html`<form>
        <oryx-select class="w100" label="Country *">
          <select
            name="country"
            .value=${this.country}
            @change=${this.countryChange}
          >
            ${countries.map((country) => {
              return html`<option
                value=${country.iso2Code}
                ?selected=${country.iso2Code === this.country}
              >
                ${country.name}
              </option>`;
            })}
          </select>
        </oryx-select>
        ${this.fieldRenderer.buildForm(data?.data?.options)}
        <oryx-button>
          <button type="submit">Submit</button>
        </oryx-button>
      </form>`;
    })}`;
  }

  protected countryChange(e: Event): void {
    const select = e.target as HTMLSelectElement;
    this.country = select.options[select.selectedIndex].value;
  }
}
