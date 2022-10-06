import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { LoginOptions } from '../login.model';

export default {
  title: `${storybookPrefix}/Login`,
  argTypes: {
    strategy: {
      options: [
        PasswordVisibilityStrategy.CLICK,
        PasswordVisibilityStrategy.MOUSEDOWN,
        PasswordVisibilityStrategy.HOVER,
        PasswordVisibilityStrategy.NONE,
      ],
      control: { type: 'radio' },
      description: 'Password field visibility strategy.',
    },
    showRememberMe: {
      type: 'boolean',
    },
    url: {
      type: 'string',
    },
  },
} as unknown as Meta;

const Template: Story<LoginOptions> = (props): TemplateResult => {
  const options = {
    strategy: props.strategy,
    showRememberMe: props.showRememberMe,
    url: props.url,
  };
  return html`<auth-login .options=${options}></auth-login>`;
};

export const Login = Template.bind({});
Login.args = {
  strategy: PasswordVisibilityStrategy.CLICK,
  showRememberMe: true,
  url: '',
};
