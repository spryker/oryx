import { expect } from '@storybook/jest';
import { userEvent, waitFor } from '@storybook/testing-library';
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
        type="radio"
        checked
        aria-label="make a11y happy"
      />
      first toggle
    </oryx-toggle>
    <oryx-toggle>
      <input
        name="test-group"
        value="second"
        type="radio"
        aria-label="make a11y happy"
      />
      second toggle
    </oryx-toggle>
    <oryx-toggle>
      <input
        name="test-group"
        value="third"
        type="radio"
        aria-label="make a11y happy"
      />
      third toggle
    </oryx-toggle>

    <style>
      oryx-toggle {
        margin-bottom: 10px;
      }
    </style>
  `;
};

export const Radio = Template.bind({});

Radio.play = async (obj: {
  args: unknown;
  canvasElement: HTMLElement;
}): Promise<void> => {
  const firstRadio = obj.canvasElement.querySelector(
    'input[value=first]'
  ) as HTMLInputElement;
  const secondRadio = obj.canvasElement.querySelector(
    'input[value=second]'
  ) as HTMLInputElement;
  const thirdRadio = obj.canvasElement.querySelector(
    'input[value=third]'
  ) as HTMLInputElement;

  await new Promise((r) => setTimeout(r, 1000));
  userEvent.click(secondRadio);
  await waitFor(() => {
    expect(firstRadio.checked).toBeFalsy();
    expect(secondRadio.checked).toBeTruthy();
    expect(thirdRadio.checked).toBeFalsy();
  });

  await new Promise((r) => setTimeout(r, 1000));
  userEvent.click(thirdRadio);
  await waitFor(() => {
    expect(firstRadio.checked).toBeFalsy();
    expect(secondRadio.checked).toBeFalsy();
    expect(thirdRadio.checked).toBeTruthy();
  });
};
