import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../constant';
import '../../index';
import { PasswordInputComponent } from '../../password-input.component';
import { PasswordVisibilityStrategy } from '../../password-input.model';

export default {
  title: `${storybookPrefix}/form/Password/visibility-strategies`,
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
    <input type="password" placeholder="Password" ?disabled=${disabled} />
  </oryx-password-input>`;
};

export const PasswordClickStrategy = Template.bind({});

PasswordClickStrategy.args = {
  timeout: 1000,
  strategy: PasswordVisibilityStrategy.CLICK,
  disabled: false,
  label: '"Click" strategy',
} as Props;

PasswordClickStrategy.play = async (obj: {
  args: Props;
  canvasElement: HTMLElement;
}): Promise<void> => {
  const component = obj.canvasElement.querySelector(
    'oryx-password-input'
  ) as PasswordInputComponent;
  const input = component.querySelector('input') as HTMLInputElement;
  const icon = component.shadowRoot?.querySelector('oryx-icon') as HTMLElement;

  userEvent.clear(input);
  await userEvent.type(input, 'Change123$', { delay: 100 });
  expect(input.type).toBe('password');
  userEvent.click(icon);
  expect(input.type).toBe('text');
  await new Promise((r) => setTimeout(r, obj.args.timeout));
  expect(input.type).toBe('password');
};
