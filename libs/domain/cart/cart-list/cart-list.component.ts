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
        <oryx-button type="text" href="/carts/create">Create cart</oryx-button>
      </div>
      <p>
        Welcome to your cart management hub! Here, you can effortlessly
        organize, review, and complete your shopping needs. Create new carts,
        track your purchases, and enjoy a seamless shopping experience. If you
        have any questions or need assistance, our support team is just a click
        away. Happy shopping!
      </p>
      ${this.$carts().map(
        (cart) => html`
          <oryx-collapsible>
            <oryx-link slot="heading">
              <a href="/cart"
                >${cart.name}
                ${this.i18n('carts.cart.totals.<count>-items', {
                  count: cart.entries.length,
                })}
              </a>
            </oryx-link>
            ${when(
              cart.current,
              () =>
                html`<oryx-chip slot="heading" appearance="success">
                  ${this.i18n('current')}
                </oryx-chip>`
            )}

            <oryx-site-price
              slot="heading"
              .value=${cart.price.value}
              .currency=${cart.price.currency}
            ></oryx-site-price>

            <!-- <div class="price" slot="heading">
            
            <span class="tax">
              ${cart.price.inclVat ? 'Tax included' : 'Tax excluded'}
            </span>
          </div> -->

            <oryx-cart-entries
              .options=${{ readonly: false }}
            ></oryx-cart-entries>
            <!-- <oryx-cart-totals></oryx-cart-totals> -->
            <div class="meta">
              <p>Euro, Gross mode</p>
              <div class="actions">
                ${when(
                  !cart.current,
                  () => html`<oryx-button size="sm">select</oryx-button>`
                )}
                <oryx-button
                  icon="edit"
                  type="icon"
                  .size=${size}
                ></oryx-button>
                <oryx-button
                  icon="content_copy"
                  type="icon"
                  .size=${size}
                ></oryx-button>
                <oryx-button
                  icon="playlist_add"
                  type="icon"
                  .size=${size}
                ></oryx-button>
                <oryx-button
                  icon="share"
                  type="icon"
                  .size=${size}
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
    // return html`<div>Cart List</div>

    //   <li>
    //     <h3>Cart name</h3>
    //     <oryx-site-price value="21000"></oryx-site-price>
    //     <span class="tax">Tax included</span>
    //     <oryx-chip appearance="info">Active</oryx-chip>
    //     <oryx-button type="outline" color="neutral" size="md"
    //       >select</oryx-button
    //     >
    //     <oryx-button icon="delete" type="icon" size="md"></oryx-button>
    //     <oryx-button icon="edit" type="icon" size="md"></oryx-button>
    //   </li> `;
  }
}
