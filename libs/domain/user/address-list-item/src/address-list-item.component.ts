import { ContentController, ContentMixin } from '@spryker-oryx/experience';
import { AlertType } from '@spryker-oryx/ui';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Address, AddressMixin } from '@spryker-oryx/user';
import { asyncValue, hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest } from 'rxjs';
import {
  AddressDefaults,
  AddressListItemAttributes,
  AddressListItemOptions,
  EDIT_EVENT,
  REMOVE_EVENT,
} from './address-list-item.model';
import { styles } from './address-list-item.styles';

@hydratable('window:load')
export class AddressListItemComponent
  extends AddressMixin(ContentMixin<AddressListItemOptions>(LitElement))
  implements AddressListItemAttributes
{
  static styles = styles;

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

      const content = html`
        <div>
          <oryx-user-address .addressId=${address.id}></oryx-user-address>
          ${this.renderActions(address, options)}
        </div>
        ${this.renderDefaults(address, options)}
      `;

      if (options.selectable) {
        return html` <oryx-radio><slot></slot>${content}</oryx-radio>`;
      }

      return html`<section>${content}</section>`;
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
              <oryx-icon type=${IconTypes.Edit}></oryx-icon>
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
              <oryx-icon type=${IconTypes.Trash}></oryx-icon>
            </button>
          </oryx-icon-button>
        `
      )}
    </div>`;
  }

  protected renderDefaults(
    address: Address,
    options: AddressListItemOptions
  ): TemplateResult {
    const showAll = options.addressDefaults === AddressDefaults.All;
    const showBilling = options.addressDefaults === AddressDefaults.Billing;
    const showShipping = options.addressDefaults === AddressDefaults.Shipping;

    const defaultBilling = address.isDefaultBilling && (showAll || showBilling);
    const defaultShipping =
      address.isDefaultShipping && (showAll || showShipping);

    if (!defaultBilling && !defaultShipping) {
      return html``;
    }

    const chip = (token: string) =>
      html`<oryx-chip appearance=${AlertType.Success}
        >${i18n(token)}</oryx-chip
      >`;

    return html`<div slot="subtext">
      ${when(defaultShipping, () =>
        chip(showAll ? 'user.address.default-shipping' : 'user.address.default')
      )}
      ${when(defaultBilling, () =>
        chip(showAll ? 'user.address.default-billing' : 'user.address.default')
      )}
    </div>`;
  }
}
