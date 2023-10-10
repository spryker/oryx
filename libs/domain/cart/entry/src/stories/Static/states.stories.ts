import { storybookDefaultViewports } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import {
  CartEntryAttributes,
  CartEntryOptions,
  RemoveByQuantity,
} from '../../entry.model';

const createEntry = (
  props: CartEntryAttributes & CartEntryOptions = {}
): TemplateResult => {
  return html`<oryx-cart-entry
    .sku=${props.sku ?? '1'}
    .quantity=${props.quantity ?? '1'}
    .price=${props.price ?? (props.quantity ?? 1) * 1879}
    .unitPrice=${props.price ?? (props.quantity ?? 1) * 2879}
    .discountedUnitPrice=${props.price ?? (props.quantity ?? 1) * 1879}
    .options=${props}
    ?readonly=${props.readonly}
  ></oryx-cart-entry>`;
};

export default {
  title: `${storybookPrefix}/Entry/Static`,
  parameters: {
    chromatic: {
      delay: 2000,
      viewports: [
        storybookDefaultViewports.mobile.min,
        storybookDefaultViewports.desktop.min,
      ],
    },
  },
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <h3>Entry</h3>
    ${createEntry()}
    <h3>Readonly</h3>
    ${createEntry({ readonly: true })}
    <h2>Enabled features</h2>
    <h3>With image</h3>
    ${createEntry({ enableItemImage: true })}
    <h3>Without image</h3>
    ${createEntry({ enableItemImage: false })}
    <h3>With ID</h3>
    ${createEntry({ enableItemId: true })}
    <h3>Without ID</h3>
    ${createEntry({ enableItemId: false })}
    <h3>With item price</h3>
    ${createEntry({ enableItemPrice: true })}
    <h3>Without item price</h3>
    ${createEntry({ enableItemPrice: false })}
    <h2>Remove by quantity</h2>
    <h3>Not allowed</h3>
    ${createEntry({ removeByQuantity: RemoveByQuantity.NotAllowed })}
    <h3>Allow Zero</h3>
    ${createEntry({ removeByQuantity: RemoveByQuantity.Allowed })}
    <h3>Show Bin</h3>
    ${createEntry({ removeByQuantity: RemoveByQuantity.ShowBin })}
  `;
};

export const States = Template.bind({});
