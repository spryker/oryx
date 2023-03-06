import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { LoginOptions } from '../login.model';

export default {
  title: `Auth/Login`,
  argTypes: {
    strategy: {
      options: [
        PasswordVisibilityStrategy.Click,
        PasswordVisibilityStrategy.Mousedown,
        PasswordVisibilityStrategy.Hover,
        PasswordVisibilityStrategy.None,
      ],
      control: { type: 'radio' },
      description: 'Password field visibility strategy.',
    },
    enableRememberMe: { type: 'boolean' },
    disableRedirect: { type: 'boolean' },
    redirectUrl: { type: 'string' },
  },
} as unknown as Meta;

const Template: Story<LoginOptions> = (props): TemplateResult => {
  const options = {
    passwordVisibility: props.passwordVisibility,
    enableRememberMe: props.enableRememberMe,
    redirectUrl: props.redirectUrl,
  };
  return html`<oryx-auth-login .options=${options}></oryx-auth-login>`;
};

export const Login = Template.bind({});
Login.args = {
  passwordVisibility: PasswordVisibilityStrategy.Click,
  enableRememberMe: true,
  redirectUrl: '',
};
