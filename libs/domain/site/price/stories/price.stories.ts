import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { SitePriceComponentAttributes } from '../price.model';

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

const Template: Story<SitePriceComponentAttributes> = (
  props: SitePriceComponentAttributes
): TemplateResult => {
  return html`<oryx-site-price
    .value=${props.value}
    .currency=${props.currency}
  ></oryx-site-price>`;
};

export const Demo = Template.bind({});
