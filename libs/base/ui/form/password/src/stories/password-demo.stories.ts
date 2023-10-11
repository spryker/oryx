import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { PasswordVisibilityStrategy } from '../password-input.model';

interface Props {
  strategy: PasswordVisibilityStrategy;
  disabled: boolean;
  timeout: number;
  label: string;
  floatLabel: boolean;
  hasError: boolean;
  errorMessage: string;
  minLength: number;
  maxLength: number;
  requireUpperLetter: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
}

export default {
  title: `${storybookPrefix}/Form/Password`,
  argTypes: {
    strategy: {
      options: ['CLICK', 'MOUSEDOWN', 'HOVER', 'NONE'],
      control: { type: 'radio' },
      description:
        'The visibility strategy determines the UI event that is used to make the password visible',
    },
    timeout: {
      type: 'number',
      description: `Sets the timeout in milliseconds that is used to revoke the visibility of the password. Defaults to 5000.`,
    },
    disabled: {
      type: 'boolean',
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<Props> = ({
  strategy,
  disabled,
  timeout,
  label,
  floatLabel,
  hasError,
  errorMessage,
  minLength,
  maxLength,
  requireUpperLetter,
  requireNumber,
  requireSpecialChar,
}: Props): TemplateResult => {
  return html`<oryx-password-input
    label=${label}
    strategy=${strategy}
    timeout=${timeout}
    ?hasError=${hasError}
    ?floatLabel=${floatLabel}
    errorMessage=${errorMessage}
    minLength=${minLength}
    maxLength=${maxLength}
    ?requireUpperLetter=${requireUpperLetter}
    ?requireNumber=${requireNumber}
    ?requireSpecialChar=${requireSpecialChar}
  >
    <input
      type="password"
      value="Change123$"
      placeholder="Placeholder..."
      ?disabled=${disabled}
    />
  </oryx-password-input>`;
};

export const PasswordDemo = Template.bind({});

PasswordDemo.args = {
  timeout: 2000,
  strategy: PasswordVisibilityStrategy.Click,
  disabled: false,
  label: 'Password with label',
  floatLabel: false,
  hasError: false,
  errorMessage: '',
  minLength: 8,
  maxLength: 20,
  requireUpperLetter: true,
  requireNumber: true,
  requireSpecialChar: true,
};
