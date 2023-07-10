import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import {
  Address,
  AddressEventDetail,
  AddressMixin,
  CrudState,
} from '@spryker-oryx/user';
import { UserAddressFormComponent } from '@spryker-oryx/user/address-form';
import { hydratable, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Observable, of, take, tap } from 'rxjs';
import {
  SaveOption,
  UserAddressEditComponentOptions,
} from './address-edit.model';
import { styles } from './address-edit.styles';

@defaultOptions({ save: SaveOption.Save, inline: false })
@hydratable(['mouseover', 'focusin'])
export class UserAddressEditComponent extends AddressMixin(
  ContentMixin<UserAddressEditComponentOptions>(LitElement)
) {
  static styles = styles;

  protected routerService = resolve(RouterService);
  protected semanticLinkService = resolve(SemanticLinkService);

  protected $listPageRoute = signal(
    this.semanticLinkService.get({ type: SemanticLinkType.AddressList })
  );

  // TODO: move to central place
  @state() loading = false;

  @query('oryx-user-address-form')
  protected addressForm?: UserAddressFormComponent;

  submit(): Observable<unknown> {
    this.loading = true;
    if (!this.preselected?.address || !this.preselected?.valid) {
      this.addressForm?.getForm()?.checkValidity();
      return of({});
    }

    const address = this.populateAddressData();
    return this.addressService[address.id ? 'update' : 'add'](address).pipe(
      take(1),
      tap(() => {
        this.loading = false;
        if (!this.$options().inline) this.addressStateService.clear();
      })
    );
  }

  protected override render(): TemplateResult | void {
    if (
      this.$options().inline &&
      this.$addressState().action !== CrudState.Create &&
      this.$addressState().action !== CrudState.Update
    ) {
      return;
    }

    return html`
      <oryx-user-address-form
        .values=${this.$address()}
        enableDefaultShipping
        enableDefaultBilling
        @change=${this.onChange}
      ></oryx-user-address-form>

      ${when(
        this.$options().save === SaveOption.Save,
        () => html`
          <oryx-button outline>
            <button @click=${this.onClose}>
              ${this.i18n(['cancel', 'user.address.cancel'])}
            </button>
          </oryx-button>
          <oryx-button ?loading=${this.loading}>
            <button @click=${this.onSave}>
              ${this.i18n(['save', 'user.address.save'])}
            </button>
          </oryx-button>
        `
      )}
    `;
  }

  protected preselected?: AddressEventDetail;

  protected onChange(e: CustomEvent<AddressEventDetail>): void {
    this.preselected = e.detail;
    if (this.$options().save === SaveOption.Instant) {
      this.submit().subscribe();
    }
  }

  protected onClose(): void {
    this.addressStateService.clear();

    const route = this.$listPageRoute();
    if (route) this.routerService.navigate(route);
  }

  protected onSave(): void {
    this.submit()
      .pipe(
        tap(() => {
          if (!this.$options().inline) this.onClose();
        })
      )
      .subscribe();
  }

  protected populateAddressData(): Address {
    const id = this.$addressId();
    return {
      ...this.preselected?.address,
      ...(id ? { id } : {}),
      isDefaultShipping: !!this.preselected?.address?.isDefaultShipping,
      isDefaultBilling: !!this.preselected?.address?.isDefaultBilling,
    };
  }
}
