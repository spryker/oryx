import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { Address, AddressService, formatAddress } from '@spryker-oryx/user';
import { hydratable } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue, observe } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs';
import {
  AddressListItemAttributes,
  AddressListItemOptions,
  EDIT_EVENT,
  REMOVE_EVENT,
} from './address-list-item.model';
import { styles } from './address-list-item.styles';

@hydratable('window:load')
export class AddressListItemComponent
  extends ComponentMixin<AddressListItemOptions>()
  implements AddressListItemAttributes
{
  static styles = styles;

  @property() addressId?: string;

  @observe()
  protected addressId$ = new BehaviorSubject(this.addressId);

  protected address$ = this.addressId$.pipe(
    distinctUntilChanged(),
    filter((addressId) => !!addressId),
    switchMap((addressId) =>
      resolve(AddressService).getAddress(addressId as string)
    )
  );

  protected addressData$ = combineLatest([
    this.address$,
    new ContentController(this).getOptions(),
  ]);

  protected emitEvent(event: string, address: Address): void {
    this.dispatchEvent(
      new CustomEvent(event, {
        bubbles: true,
        composed: true,
        detail: { address },
      })
    );
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(this.addressData$, ([address, options]) => {
      if (!address) {
        return html``;
      }

      if (options.selectable) {
        return html` <oryx-radio>
          <slot></slot>
          <span>${formatAddress(address)}</span>
          ${this.renderActions(address, options)}
          ${this.renderDefaults(address, options)}
        </oryx-radio>`;
      }

      return html`
        <section>
          ${formatAddress(address)} ${this.renderActions(address, options)}
          ${this.renderDefaults(address, options)}
        </section>
      `;
    })}`;
  }

  protected renderActions(
    address: Address,
    options: AddressListItemOptions
  ): TemplateResult {
    if (!options.editable && !options.removable) {
      return html``;
    }

    return html`<div class="controls">
      ${when(
        options.editable,
        () => html`
          <oryx-icon-button>
            <button
              aria-label=${i18n('user.address.edit')}
              @click=${(): void => this.emitEvent(EDIT_EVENT, address)}
            >
              <oryx-icon type="edit"></oryx-icon>
            </button>
          </oryx-icon-button>
        `
      )}
      ${when(
        options.removable,
        () => html`
          <oryx-icon-button>
            <button
              aria-label=${i18n('user.address.remove')}
              @click=${(): void => this.emitEvent(REMOVE_EVENT, address)}
            >
              <oryx-icon type="trash"></oryx-icon>
            </button>
          </oryx-icon-button>
        `
      )}
    </div>`;
  }

  protected renderChip(token: string): TemplateResult {
    return html` <oryx-chip appearance="active">${i18n(token)}</oryx-chip>`;
  }

  protected renderDefaults(
    address: Address,
    options: AddressListItemOptions
  ): TemplateResult {
    const defaultBilling = options.defaultBilling && address.isDefaultBilling;
    const defaultShipping =
      options.defaultShipping && address.isDefaultShipping;

    if (defaultBilling && defaultShipping) {
      return html`<div slot="subtext">
        ${this.renderChip('user.address.default-shipping')}
        ${this.renderChip('user.address.default-billing')}
      </div>`;
    }
    if (
      (!defaultBilling && defaultShipping) ||
      (defaultBilling && !defaultShipping)
    ) {
      return html`<div slot="subtext">
        ${this.renderChip('user.address.default')}
      </div>`;
    } else {
      return html``;
    }
  }
}
