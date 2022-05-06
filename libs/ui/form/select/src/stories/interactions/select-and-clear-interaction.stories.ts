import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../../../../option/src';
import { states } from '../../../../../utilities/storybook';
import '../../index';
import { SelectComponent } from '../../index';

export default {
  title: `${storybookPrefix}/Form/Select/Interaction`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-select>
      <input placeholder="select something from the list" />
      ${states.map((state) => html`<oryx-option>${state}</oryx-option>`)}
    </oryx-select>
  `;
};

export const SelectAndClear = Template.bind({});

SelectAndClear.play = async (obj: {
  args: unknown;
  canvasElement: HTMLElement;
}): Promise<void> => {
  const forEach = async (arr: unknown[], cb: any): Promise<void> => {
    for (const item of arr) {
      await cb(item);
    }
  };

  const keyboard = async (key: string, times = 1): Promise<void> => {
    await forEach(Array(times), async (): Promise<void> => {
      await userEvent.keyboard(key);
      await new Promise((resolve) => setTimeout(resolve, 500));
    });
  };

  const component = obj.canvasElement.querySelector(
    'oryx-select'
  ) as SelectComponent;
  const input = component.querySelector('input') as HTMLInputElement;
  const clearIcon = component.shadowRoot?.querySelector(
    'oryx-icon.clear'
  ) as HTMLInputElement;

  userEvent.click(input);
  await keyboard('[ArrowDown]', 3);
  await keyboard('[Enter]');

  userEvent.hover(clearIcon);
  await new Promise((resolve) => setTimeout(resolve, 500));
  userEvent.click(clearIcon);
};
