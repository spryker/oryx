import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { CheckoutAccountComponentOptions } from '../account.model';

export default {
  title: `${storybookPrefix}/Customer`,
  args: {
    enableGuestCheckout: true,
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

const Template: Story<CheckoutAccountComponentOptions> = (
  props: CheckoutAccountComponentOptions
): TemplateResult => {
  return html`<oryx-checkout-account
    .options=${props}
  ></oryx-checkout-account>`;
};

export const Demo = Template.bind({});
