import { ContentMixin } from '@spryker-oryx/experience';
import { ButtonType } from '@spryker-oryx/ui/button';
import { Address, AddressMixin } from '@spryker-oryx/user';
import { AddressFormComponent } from '@spryker-oryx/user/address-form';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { catchError, tap, throwError } from 'rxjs';
import { BACK_EVENT, SUCCESS_EVENT } from './address-edit.model';
import { styles } from './address-edit.styles';

@hydratable(['mouseover', 'focusin'])
export class AddressEditComponent extends AddressMixin(
  ContentMixin(LitElement)
) {
  static styles = styles;

  protected formRef: Ref<AddressFormComponent> = createRef();

  protected triggerSubmit(): void {
    this.formRef.value?.submit();
  }

  protected ensureAddress(address: Address): Address {
    return {
      ...address,
      isDefaultShipping: !!address.isDefaultShipping,
      isDefaultBilling: !!address.isDefaultBilling,
      ...(this.addressId ? { id: this.addressId } : {}),
    };
  }

  protected onSubmit(e: CustomEvent): void {
    this.addressService[this.addressId ? 'updateAddress' : 'addAddress'](
      this.ensureAddress(e.detail.values as Address)
    )
      .pipe(
        catchError((e) => throwError(() => e)),
        tap(() => this.emitEvent(SUCCESS_EVENT))
      )
      .subscribe();
  }

  protected emitEvent(event: string): void {
    this.dispatchEvent(
      new CustomEvent(event, { composed: true, bubbles: true })
    );
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-address-form
        ${ref(this.formRef)}
        .values=${this.addressValue}
        enableDefaultShipping
        enableDefaultBilling
        @oryx.submit=${(e: CustomEvent) => this.onSubmit(e)}
      ></oryx-address-form>

      <oryx-button outline type=${ButtonType.Secondary}>
        <button @click=${(): void => this.emitEvent(BACK_EVENT)}>
          ${i18n('user.address.back')}
        </button>
      </oryx-button>

      <oryx-button>
        <button @click=${this.triggerSubmit}>
          ${i18n('user.address.save')}
        </button>
      </oryx-button>
    `;
  }
}
