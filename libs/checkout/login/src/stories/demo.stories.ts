import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { CheckoutLoginOptions } from '../login.model';

export default {
  title: `${storybookPrefix}/Login`,
  argTypes: {
    guestUrl: {
      type: 'string',
    },
    loginUrl: {
      type: 'string',
    },
    disableGuest: {
      type: 'boolean',
    },
  },
} as unknown as Meta;

const Template: Story<CheckoutLoginOptions> = (props): TemplateResult => {
  return html`
    <style>
      checkout-login {
        --oryx-layout-gap: 30px;
        align-items: stretch;
      }
    </style>
    <checkout-login .options=${props}></checkout-login>
  `;
};

export const LoginDemo = Template.bind({});

LoginDemo.args = {
  disableGuest: false,
};
