import { cartTotalsStaticData } from '@spryker-oryx/cart/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Cart Totals`,
  args: {
    mockUid: 'all',
  },
  argTypes: {
    mockUid: {
      control: { type: 'select' },
      options: cartTotalsStaticData.map((d) => d.id),
      table: { category: 'demo' },
    },
  },
} as Meta;

const Template: Story = (props): TemplateResult => {
  return html`<oryx-cart-totals .uid=${props.mockUid}></oryx-cart-totals>`;
};

export const Demo = Template.bind({});
