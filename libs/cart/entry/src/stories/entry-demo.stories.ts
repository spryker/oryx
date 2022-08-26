import { useComponent } from '@spryker-oryx/core/utilities';
import { MockProductService } from '@spryker-oryx/product';
import { Icons, IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit-html';
import { customElement, property, state } from 'lit/decorators.js';
import { storybookPrefix } from '../../../.constants';
import { setupCartMocks } from '../../../src/mocks/cart.mock';
import { CartEntryOptions } from '../entry.model';
import { cartEntryComponents } from '../index';

useComponent(cartEntryComponents);

type FakeEntriesProps = {
  sku: string;
  productOptions: boolean;
  defaultExpandedOptions: boolean;
  hidePreview: boolean;
  silentRemove: boolean;
  removeButtonIcon?: Icons;
};

export default {
  title: `${storybookPrefix}/Entry`,
  loaders: [setupCartMocks()],
} as unknown as Meta;

@customElement('fake-entries')
class FakeEntriesComponent extends LitElement {
  @property({ type: String }) sku?: string;
  @property({ type: Object }) props?: FakeEntriesProps;
  @state() entry?: CartEntryOptions;

  requestUpdate(name: PropertyKey, oldValue?: unknown): void {
    if (
      (name === 'sku' && this.sku !== oldValue) ||
      (name === 'props' && this.props !== oldValue)
    ) {
      this.updateEntry();
    }

    super.requestUpdate(name, oldValue);
  }

  protected selectedProductOptions = [
    {
      optionGroupName: 'Three (3) year limited warranty',
      sku: 'OP_3_year_warranty',
      optionName: 'Three (3) year limited warranty',
      price: 2000,
    },
    {
      optionGroupName: 'Two (2) year insurance coverage',
      sku: 'OP_insurance',
      optionName: 'Two (2) year insurance coverage',
      price: 10000,
    },
    {
      optionGroupName: 'Gift wrapping',
      sku: 'OP_gift_wrapping',
      optionName: 'Gift wrapping',
      price: 500,
    },
  ];

  protected updateEntry(quantity = 1): void {
    const product = MockProductService.mockProducts.find(
      ({ sku }) => sku === this.sku
    );
    const unitPrice = product?.price?.defaultPrice?.value ?? 0;
    const sumPrice = unitPrice * quantity;

    const hasOptions = !!this.props?.productOptions;
    const optionsPrice = hasOptions
      ? this.selectedProductOptions.reduce((sum, { price }) => sum + price, 0)
      : 0;

    this.entry = {
      sku: this.sku as string,
      quantity,
      groupKey: this.sku as string,
      abstractSku: this.sku as string,
      calculations: {
        unitPrice,
        sumPrice,
        unitPriceToPayAggregation: sumPrice + optionsPrice,
      },
      ...(hasOptions
        ? {
            selectedProductOptions: this.selectedProductOptions,
          }
        : {}),
    };
  }

  protected override render(): TemplateResult {
    return html` <cart-entry
      .options=${{ ...this.props, ...this.entry }}
      @oryx.remove=${(): void => console.log('remove')}
      @oryx.quantity=${(e: CustomEvent): void =>
        this.updateEntry(e.detail.quantity)}
    ></cart-entry>`;
  }
}

const Template: Story<FakeEntriesProps> = (
  props: FakeEntriesProps
): TemplateResult => {
  return html`
    <fake-entries .sku=${props.sku} .props=${props}></fake-entries>
  `;
};

export const Demo = Template.bind({});

Demo.args = {
  sku: MockProductService.mockProducts[0].sku,
  productOptions: true,
  defaultExpandedOptions: false,
  hidePreview: false,
  silentRemove: false,
};

Demo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: MockProductService.mockProducts.map((p) => p.sku),
  },
  removeButtonIcon: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
  },
};
