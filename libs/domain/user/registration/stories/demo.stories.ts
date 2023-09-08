import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { RegistrationOptions } from '../registration.model';

export default {
  title: `${storybookPrefix}/Registration`,
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
  },
} as Meta;

const Template: Story<RegistrationOptions> = (props): TemplateResult => {
  return html`<oryx-user-registration
    .options=${props}
  ></oryx-user-registration>`;
};

export const Demo = Template.bind({});
Demo.args = {
  passwordVisibility: PasswordVisibilityStrategy.Click,
  minLength: 8,
  maxLength: 32,
  minUppercaseChars: 1,
  minNumbers: 1,
  minSpecialChars: 1,
  termsAndConditionsLink: '/terms-and-conditions',
};
