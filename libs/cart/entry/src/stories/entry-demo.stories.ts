import { MockProductService } from '@spryker-oryx/product/mocks';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { storybookPrefix } from '../../../.constants';
import {
  CartEntryCompositionOptions,
  CartEntryOptions,
  RemoveByQuantity,
} from '../entry.model';
import { selectedProductOptions } from './common';

interface FakeEntriesProps extends CartEntryCompositionOptions {
  productOptions: boolean;
}

export default {
  title: `${storybookPrefix}/Entry`,
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

  protected updateEntry(quantity = 1): void {
    const product = MockProductService.mockProducts.find(
      ({ sku }) => sku === this.sku
    );
    const unitPrice = product?.price?.defaultPrice?.value ?? 0;
    const sumPrice = unitPrice * quantity;

    const hasOptions = !!this.props?.productOptions;
    const optionsPrice = hasOptions
      ? selectedProductOptions.reduce((sum, { price }) => sum + price, 0)
      : 0;

    this.entry = {
      sku: this.sku as string,
      quantity,
      groupKey: this.sku as string,
      abstractSku: this.sku as string,
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

Demo.parameters = {
  chromatic: {
    disableSnapshot: true,
  },
};

Demo.args = {
  sku: MockProductService.mockProducts[0].sku,
  productOptions: true,
  defaultExpandedOptions: false,
  hidePreview: false,
  silentRemove: false,
  disabled: false,
  updating: false,
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
  removeByQuantity: {
    options: Object.values(RemoveByQuantity),
    control: { type: 'select' },
  },
};
