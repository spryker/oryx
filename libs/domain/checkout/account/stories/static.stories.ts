import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { CheckoutAccountComponentOptions } from '../account.model';

export default {
  title: `${storybookPrefix}/Customer/Static`,
} as Meta;

const Template: Story<CheckoutAccountComponentOptions> = (
  props: CheckoutAccountComponentOptions
): TemplateResult => {
  return html`<oryx-checkout-account
    .options=${props}
  ></oryx-checkout-account>`;
};

export const GuestEnabled = Template.bind({});
GuestEnabled.args = { enableGuestCheckout: true };

export const GuestDisabled = Template.bind({});
GuestDisabled.args = { enableGuestCheckout: false };
