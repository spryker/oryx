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

export const PasswordHoverStrategy = Template.bind({});

PasswordHoverStrategy.args = {
  strategy: PasswordVisibilityStrategy.HOVER,
  label: '"Hover" strategy',
} as Props;

PasswordHoverStrategy.play = async (obj: {
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
  userEvent.hover(icon);
  await new Promise((r) => setTimeout(r, 500));
  expect(input.type).toBe('text');
  userEvent.unhover(icon);
  expect(input.type).toBe('password');
};
