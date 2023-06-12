import { states } from '@/tools/storybook';
import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { FilterStrategyType } from '../../../../../search/typeahead';

import { SelectComponent } from '../../index';

export default {
  title: `${storybookPrefix}/Form/Select/Interactive`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-select .filterStrategy=${FilterStrategyType.START_WITH}>
      <select>
        <option value hidden>select something from the list</option>
        ${states.map(
          (state) => html`<option value="val_${state}">${state}</option>`
        )}
      </select>
    </oryx-select>
  `;
};

export const SelectCustomValue = Template.bind({});

SelectCustomValue.play = async (obj: {
  args: unknown;
  canvasElement: HTMLElement;
}): Promise<void> => {
  const component = obj.canvasElement.querySelector(
    'oryx-select'
  ) as SelectComponent;
  const select = component.querySelector('select') as HTMLSelectElement;
  const typeInput = component.shadowRoot?.querySelector(
    'input'
  ) as HTMLInputElement;
  userEvent.clear(typeInput);
  await userEvent.type(typeInput, 'ohio', { delay: 300 });
  expect(select.value).toBe('val_Ohio');
  await new Promise((r) => setTimeout(r, 300));
  userEvent.click(typeInput);
};
