import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { PasswordInputComponent } from '../../index';
import { PasswordVisibilityStrategy } from '../../password-input.model';

export default {
  title: `${storybookPrefix}/Form/Password/Interactive`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<oryx-password-input
    label="Hover strategy"
    strategy=${PasswordVisibilityStrategy.Hover}
    timeout="1000"
  >
    <input type="password" value="Change123$" placeholder="Placeholder..." />
  </oryx-password-input>`;
};

export const HoverStrategy = Template.bind({});

HoverStrategy.play = async (obj: {
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
  userEvent.hover(icon);
  await new Promise((r) => setTimeout(r, 500));
  expect(input.type).toBe('text');
  userEvent.unhover(icon);
  expect(input.type).toBe('password');
};
