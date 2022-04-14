import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.storybook/constant';
import '../index';
import { PasswordVisibilityStrategy } from '../password-input.model';

export default {
  title: `${storybookPrefix}/form/Password`,
} as Meta;

interface Props {
  strategy: PasswordVisibilityStrategy;
  disabled: boolean;
  timeout: number;
  label: string;
}

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

export const PasswordDisabled = Template.bind({});

PasswordDisabled.args = {
  strategy: PasswordVisibilityStrategy.NONE,
  disabled: true,
  label: 'Disabled Password',
};
