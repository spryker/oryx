import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { PriceComponentAttributes } from '../price.model';

export default {
  title: `${storybookPrefix}/price`,
  args: {
    value: 1234,
  },
  argTypes: {
    currency: {
      control: { type: 'select' },
      options: ['USD', 'EUR', 'GBP', 'NOK', 'ZWL'],
    },
  },
} as Meta;

const Template: Story<PriceComponentAttributes> = (
  props: PriceComponentAttributes
): TemplateResult => {
  return html`<oryx-site-price
    .value=${props.value}
    .currency=${props.currency}
  ></oryx-site-price>`;
};

export const Demo = Template.bind({});
