import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Actions/Toggle/Interactive`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-toggle>
      <input
        name="test-group"
        value="first"
        type="checkbox"
        checked
        aria-label="make a11y happy"
      />
      first toggle
    </oryx-toggle>
    <oryx-toggle>
      <input
        name="test-group"
        value="second"
        type="checkbox"
        aria-label="make a11y happy"
      />
      second toggle
    </oryx-toggle>

    <style>
      oryx-toggle {
        margin-bottom: 10px;
      }
    </style>
  `;
};

export const Checkbox = Template.bind({});

Checkbox.play = async (obj: {
  args: unknown;
  canvasElement: HTMLElement;
}): Promise<void> => {
  const firstCheckbox = obj.canvasElement.querySelector(
    'input[value=first]'
  ) as HTMLInputElement;
  const secondCheckbox = obj.canvasElement.querySelector(
    'input[value=second]'
  ) as HTMLInputElement;

  await new Promise((r) => setTimeout(r, 1000));
  userEvent.click(firstCheckbox);

  await new Promise((r) => setTimeout(r, 1000));
  userEvent.click(secondCheckbox);

  expect(firstCheckbox.checked).toBeFalsy();
  expect(secondCheckbox.checked).toBeTruthy();
};
