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
        PasswordVisibilityStrategy.Click,
        PasswordVisibilityStrategy.Mousedown,
        PasswordVisibilityStrategy.Hover,
        PasswordVisibilityStrategy.None,
      ],
      control: { type: 'radio' },
      description: 'Password field visibility strategy.',
    },
    showRememberMe: {
      type: 'boolean',
    },
    disableRedirect: {
      type: 'boolean',
    },
    url: {
      type: 'string',
    },
  },
} as unknown as Meta;

const Template: Story<LoginOptions> = (props): TemplateResult => {
  const options = {
    strategy: props.passwordVisibility,
    showRememberMe: props.enableRememberMe,
    url: props.redirectUrl,
  };
  return html`<auth-login .options=${options}></auth-login>`;
};

export const Login = Template.bind({});
Login.args = {
  passwordVisibility: PasswordVisibilityStrategy.Click,
  enableRememberMe: true,
  redirectUrl: '',
};
