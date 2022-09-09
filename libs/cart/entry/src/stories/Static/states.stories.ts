import { setupCartMocks } from '@spryker-oryx/cart/mocks';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix, storybookViewports } from '../../../../.constants';
import { CartEntryCompositionOptions } from '../../entry.model';
import { selectedProductOptions } from '../common';

const sku = '1';

const createEntry = (
  options: Partial<CartEntryCompositionOptions> = {},
  hasOptions = true
): CartEntryCompositionOptions => {
  const quantity = options?.quantity ?? 1;
  const product = MockProductService.mockProducts.find(
    (product) => sku === product.sku
  );
  const unitPrice = product?.price?.defaultPrice?.value ?? 0;
  const sumPrice = unitPrice * quantity;

  const optionsPrice = hasOptions
    ? selectedProductOptions.reduce((sum, { price }) => sum + price, 0)
    : 0;

  return {
    sku,
    quantity,
    groupKey: sku,
    abstractSku: sku,
    calculations: {
      unitPrice,
      sumPrice,
      sumPriceToPayAggregation: sumPrice + optionsPrice,
    },
    ...(hasOptions
      ? {
          selectedProductOptions,
        }
      : {}),
    ...options,
  };
};

export default {
  title: `${storybookPrefix}/Entry/Static`,
  loaders: [setupCartMocks()],
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const interval = setInterval(() => {
    if (!customElements.get('cart-entry')) {
      return;
    }

    clearInterval(interval);

    (
      (
        document.querySelector('.with-confirmation') as LitElement
      )?.shadowRoot?.querySelector(
        'oryx-icon-button button'
      ) as HTMLButtonElement
    )?.click();
  }, 100);

  return html`
    <p>Entry</p>
    <cart-entry .options=${createEntry()}></cart-entry>

    <p>Expanded options</p>
    <cart-entry
      .options=${createEntry({ defaultExpandedOptions: true })}
    ></cart-entry>

    <p>Without options</p>
    <cart-entry .options=${createEntry({}, false)}></cart-entry>

    <p>Without preview</p>
    <cart-entry .options=${createEntry({ hidePreview: true })}></cart-entry>

    <p>Multiple quantity</p>
    <cart-entry .options=${createEntry({ quantity: 3 })}></cart-entry>

    <p>Custom remove button</p>
    <cart-entry
      .options=${createEntry({ removeButtonIcon: 'trash' })}
    ></cart-entry>

    <p>With confirmation</p>
    <cart-entry
      class="with-confirmation"
      .options=${createEntry()}
    ></cart-entry>

    <p>Disabled</p>
    <cart-entry .options=${createEntry({ disabled: true })}></cart-entry>

    <p>Updated</p>
    <cart-entry .options=${createEntry({ updating: true })}></cart-entry>
  `;
};

export const States = Template.bind({});

States.parameters = {
  chromatic: {
    delay: 3000,
    viewports: [storybookViewports.mobile.min, storybookViewports.desktop.min],
  },
};
