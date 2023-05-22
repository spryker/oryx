import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { CheckoutAuthComponentOptions } from '../customer.model';

export default {
  title: `${storybookPrefix}/Customer/Static`,
} as Meta;

const Template: Story<CheckoutAuthComponentOptions> = (
  props: CheckoutAuthComponentOptions
): TemplateResult => {
  return html`<oryx-checkout-customer
    .options=${props}
  ></oryx-checkout-customer>`;
};

export const GuestEnabled = Template.bind({});
GuestEnabled.args = { enableGuestCheckout: true };

export const GuestDisabled = Template.bind({});
GuestDisabled.args = { enableGuestCheckout: false };
