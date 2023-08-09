import { cartTotalsStaticData } from '@spryker-oryx/cart/mocks';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Totals`,
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
  return html`<oryx-order-totals .uid=${props.mockUid}></oryx-order-totals>`;
};

export const Demo = Template.bind({});
