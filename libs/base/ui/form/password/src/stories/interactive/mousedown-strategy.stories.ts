import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { PasswordInputComponent } from '../../index';
import { PasswordVisibilityStrategy } from '../../password-input.model';

export default {
  title: `${storybookPrefix}/Form/Password/Interactive`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<oryx-password-input
    label="Mousedown strategy"
    strategy=${PasswordVisibilityStrategy.Mousedown}
  >
    <input type="password" value="Change123$" placeholder="Placeholder..." />
  </oryx-password-input>`;
};

export const MousedownStrategy = Template.bind({});

MousedownStrategy.play = async (obj: {
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
  expect(input.type).toBe('password');
  // We are not able to simulate MOUSEDOWN event with the `userEvent` API
  // because testing-library-v13 does not provide this API
  icon.dispatchEvent(new Event('mousedown'));
  expect(input.type).toBe('text');
  await new Promise((r) => setTimeout(r, 1000));
  icon.dispatchEvent(new Event('mouseout'));
  expect(input.type).toBe('password');
};
