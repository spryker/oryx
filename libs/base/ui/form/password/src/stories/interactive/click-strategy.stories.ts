import { expect } from '@storybook/jest';
import { userEvent, waitFor } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { PasswordInputComponent } from '../../password-input.component';
import { PasswordVisibilityStrategy } from '../../password-input.model';

export default {
  title: `${storybookPrefix}/Form/Password/Interactive`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<oryx-password-input
    label="Click strategy"
    strategy=${PasswordVisibilityStrategy.Click}
    timeout=${1000}
  >
    <input type="password" placeholder="Password" />
  </oryx-password-input>`;
};

export const ClickStrategy = Template.bind({});

ClickStrategy.play = async (obj: {
  args: unknown;
  canvasElement: HTMLElement;
}): Promise<void> => {
  const component = obj.canvasElement.querySelector(
    'oryx-password-input'
  ) as PasswordInputComponent;
  const input = component.querySelector('input') as HTMLInputElement;
  const icon = component.shadowRoot?.querySelector('oryx-icon') as HTMLElement;

  userEvent.clear(input);
  await userEvent.type(input, 'Change123$', { delay: 100 });
  await waitFor(() => expect(input.type).toBe('password'));
  userEvent.click(icon);
  await waitFor(() => expect(input.type).toBe('text'));
  await new Promise((r) => setTimeout(r, 1000));
  await waitFor(() => expect(input.type).toBe('password'));
};
