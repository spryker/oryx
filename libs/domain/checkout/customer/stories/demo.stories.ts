import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { CheckoutAuthComponentOptions } from '../customer.model';

export default {
  title: `${storybookPrefix}/Customer`,
  args: {
    enableGuestCheckout: true,
  },
} as Meta;

const Template: Story<CheckoutAuthComponentOptions> = (
  props: CheckoutAuthComponentOptions
): TemplateResult => {
  return html`<oryx-checkout-customer
    .options=${props}
  ></oryx-checkout-customer>`;
};

export const Demo = Template.bind({});
