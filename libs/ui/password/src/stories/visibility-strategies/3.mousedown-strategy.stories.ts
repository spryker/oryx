import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../constant';
import '../../index';
import { PasswordInputComponent } from '../../index';
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
    .options=${{ label }}
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

export const PasswordMousedownStrategy = Template.bind({});

PasswordMousedownStrategy.args = {
  strategy: PasswordVisibilityStrategy.MOUSEDOWN,
  label: '"Mousedown" strategy',
};

PasswordMousedownStrategy.play = async (obj: {
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
  // We are not able to simulate MOUSEDOWN event with the `userEvent` API
  // because testing-library-v13 does not provide this API
  icon.dispatchEvent(new Event('mousedown'));
  expect(input.type).toBe('text');
  await new Promise((r) => setTimeout(r, 1000));
  icon.dispatchEvent(new Event('mouseout'));
  expect(input.type).toBe('password');
};
