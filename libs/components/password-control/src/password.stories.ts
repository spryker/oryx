import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import './index';
import { PasswordVisibilityStrategy } from './model';

interface Props {
  strategy: PasswordVisibilityStrategy;
  disabled: boolean;
  timeout: number;
}

export default {
  title: 'form/PasswordControl',
} as Meta;

const Template: Story<Props> = ({
  strategy,
  disabled,
  timeout,
}: Props): TemplateResult => {
  return html`<oryx-password-control
    label="With label"
    ?disabled=${disabled}
    strategy=${strategy}
    timeout=${timeout}
  >
    <input type="password" value="Change123$" placeholder="Placeholder..." />
  </oryx-password-control>`;
};
export const Password = Template.bind({});
Password.argTypes = {
  strategy: {
    options: ['CLICK', 'MOUSEDOWN', 'HOVER', 'NONE'],
    control: { type: 'radio' },
    defaultValue: 'CLICK',
  },
  timeout: {
    control: { type: 'number' },
    defaultValue: 2000,
  },
  disabled: {
    control: { type: 'boolean' },
    defaultValue: false,
  },
};
