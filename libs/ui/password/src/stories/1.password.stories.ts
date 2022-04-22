import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.storybook/constant';
import '../index';
import { PasswordVisibilityStrategy } from '../password-input.model';

interface Props {
  strategy: PasswordVisibilityStrategy;
  disabled: boolean;
  timeout: number;
  label: string;
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
} as Meta;

const Template: Story<Props> = ({
  strategy,
  disabled,
  timeout,
  label,
}: Props): TemplateResult => {
  return html`<oryx-password-input
    label=${label}
    strategy=${strategy}
    timeout=${timeout}
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
  strategy: PasswordVisibilityStrategy.CLICK,
  disabled: false,
  label: 'Password with label',
};
