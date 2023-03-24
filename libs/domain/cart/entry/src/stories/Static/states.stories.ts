import { MockProductService } from '@spryker-oryx/product/mocks';
import { storybookDefaultViewports } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, LitElement, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import {
  CartEntryCompositionOptions,
  RemoveByQuantity,
} from '../../entry.model';
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
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const interval = setInterval(() => {
    if (!customElements.get('oryx-cart-entry')) {
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
    <oryx-cart-entry .options=${createEntry()}></oryx-cart-entry>

    <p>Expanded options</p>
    <oryx-cart-entry
      .options=${createEntry({ defaultExpandedOptions: true })}
    ></oryx-cart-entry>

    <p>Without options</p>
    <oryx-cart-entry .options=${createEntry({}, false)}></oryx-cart-entry>

    <p>Without preview</p>
    <oryx-cart-entry
      .options=${createEntry({ hidePreview: true })}
    ></oryx-cart-entry>

    <p>Multiple quantity</p>
    <oryx-cart-entry .options=${createEntry({ quantity: 3 })}></oryx-cart-entry>

    <p>Custom remove button</p>
    <oryx-cart-entry
      .options=${createEntry({ removeButtonIcon: 'trash' as any })}
    ></oryx-cart-entry>

    <p>With confirmation</p>
    <oryx-cart-entry
      class="with-confirmation"
      .options=${createEntry()}
    ></oryx-cart-entry>

    <p>Disabled</p>
    <oryx-cart-entry
      .options=${createEntry({ disabled: true })}
    ></oryx-cart-entry>

    <p>Updated</p>
    <oryx-cart-entry
      .options=${createEntry({ updating: true })}
    ></oryx-cart-entry>

    <p>Allow zero quantity</p>
    <oryx-cart-entry
      .options=${createEntry({ removeByQuantity: RemoveByQuantity.AllowZero })}
    ></oryx-cart-entry>

    <p>Allow zero quantity with bin</p>
    <oryx-cart-entry
      .options=${createEntry({
        removeByQuantity: RemoveByQuantity.ShowBin,
        quantity: 1,
      })}
    ></oryx-cart-entry>

    <p>Readonly</p>
    <oryx-cart-entry
      .options=${createEntry({ readonly: true })}
    ></oryx-cart-entry>
  `;
};

export const States = Template.bind({});

States.parameters = {
  chromatic: {
    delay: 3000,
    viewports: [
      storybookDefaultViewports.mobile.min,
      storybookDefaultViewports.desktop.min,
    ],
  },
};
