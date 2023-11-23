import { ContentMixin } from '@spryker-oryx/experience';
import { Size, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { cartListStyles } from './cart-list.styles';

const mock = [
  {
    id: 0,
    name: 'First cart',
    price: { value: 950, inclVat: true, currency: 'EUR' },
    entries: [{}],
  },
  {
    id: 1,
    name: 'Abc',
    price: { value: 10050, inclVat: true, currency: 'EUR' },
    current: true,
    entries: [{}, {}, {}],
  },
  {
    name: 'Def',
    id: 2,
    price: { value: 20013, inclVat: false, currency: 'SWF' },
    entries: [{}, {}, {}, {}],
  },
  {
    name: 'Abandoned cart',
    id: 3,
    price: { value: 0, inclVat: false, currency: 'EUR' },
    entries: [],
  },
  {
    name: 'Old cart',
    id: 4,
    price: { value: 177013, inclVat: false, currency: 'EUR' },
    entries: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  },
  {
    name: 'Abandoned cart',
    id: 3,
    price: { value: 0, inclVat: false, currency: 'EUR' },
    entries: [],
  },
  {
    name: 'Old cart',
    id: 4,
    price: { value: 177013, inclVat: false, currency: 'EUR' },
    entries: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
  },
  {
    name: 'First cart',
    id: 3,
    price: { value: 0, inclVat: false, currency: 'EUR' },
    entries: [],
  },
  {
    name: 'Old cart',
    id: 4,
    price: { value: 177013, inclVat: false, currency: 'EUR' },
    entries: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  },
  {
    name: 'Test',
    id: 3,
    price: { value: 0, inclVat: false, currency: 'EUR' },
    entries: [],
  },
  {
    name: 'Old cart',
    id: 4,
    price: { value: 177013, inclVat: false, currency: 'EUR' },
    entries: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  },
];

const size = Size.Md;

export class CartListComponent extends ContentMixin(LitElement) {
  static styles = cartListStyles;
  protected $carts = signal(mock);

  protected override render(): TemplateResult {
    return html`
      <div class="heading">
        <h1>
          ${this.i18n('carts.totals.<count>-items', {
            count: this.$carts().length,
          })}
        </h1>
        <oryx-button type="text" href="/create-cart">Create cart</oryx-button>
      </div>
      <p>
        Manage your carts with ease. Create, track, and shop effortlessly. Need
        help? Our support team is here for you. Enjoy your shopping!
      </p>

      ${this.$carts().map(
        (cart) => html`
          <oryx-collapsible>
            <oryx-link slot="heading">
              ${cart.name}
              ${this.i18n('carts.cart.totals.<count>-items', {
                count: cart.entries.length,
              })}
            </oryx-link>
            ${when(
              cart.current,
              () =>
                html`<oryx-chip slot="heading" appearance="success">
                  ${this.i18n('default')}
                </oryx-chip>`
            )}

            <oryx-site-price
              slot="heading"
              .value=${cart.price.value}
              .currency=${cart.price.currency}
            ></oryx-site-price>
            <span slot="heading"
              >(${cart.price.inclVat ? `Gross` : `Net`})</span
            >

            ${when(
              !cart.entries?.length,
              () =>
                html`<p>There are no cart entries for this cart available.</p>`,
              () => html`
                <oryx-cart-entries
                  .options=${{ readonly: false }}
                ></oryx-cart-entries>
              `
            )}

            <div class="meta">
              ${when(
                !cart.current,
                () =>
                  html`<oryx-button type="outline" .size=${size}>
                    Make default
                  </oryx-button>`
              )}

              <div class="actions">
                <oryx-button
                  icon="edit"
                  type="icon"
                  .size=${size}
                ></oryx-button>
                <oryx-button
                  icon="content_copy"
                  type="icon"
                  .size=${size}
                  ?disabled=${!cart.entries?.length}
                ></oryx-button>
                <oryx-button
                  icon="playlist_add"
                  type="icon"
                  .size=${size}
                  ?disabled=${!cart.entries?.length}
                ></oryx-button>
                <oryx-button
                  icon="share"
                  type="icon"
                  .size=${size}
                ></oryx-button>
                <oryx-button
                  icon="download"
                  type="icon"
                  .size=${size}
                  ?disabled=${!cart.entries?.length}
                ></oryx-button>
                <oryx-button
                  icon="delete"
                  type="icon"
                  .size=${size}
                ></oryx-button>
              </div>
            </div>
          </oryx-collapsible>
        `
      )}
      <oryx-pagination> <a>1</a><a>2</a><a>3</a> </oryx-pagination>
    `;
  }
}
