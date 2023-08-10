import { cartTotalsStaticData } from '@spryker-oryx/cart/mocks';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Totals`,
  args: {
    uid: 'all',
  },
  argTypes: {
    uid: {
      control: { type: 'select' },
      options: cartTotalsStaticData.map((d) => d.id),
      table: { category: 'demo' },
    },
  },
} as Meta;

const Template: Story = (props): TemplateResult => {
  return html`<oryx-order-totals .uid=${props.uid}></oryx-order-totals>`;
};

export const Demo = Template.bind({});
