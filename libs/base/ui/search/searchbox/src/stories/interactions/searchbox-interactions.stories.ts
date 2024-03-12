import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { SearchboxComponent } from '../../searchbox.component';

export default {
  title: `${storybookPrefix}/Search/Searchbox/Interactive`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <div style="width:300px">
      <oryx-search label="search">
        <input placeholder="Search..." />
      </oryx-search>
    </div>
  `;
};
export const SearchboxInteractive = Template.bind({});

SearchboxInteractive.parameters = {
  chromatic: { disableSnapshot: true },
};

SearchboxInteractive.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const component = obj.canvasElement.querySelector(
    'oryx-search'
  ) as SearchboxComponent;
  const input = component.querySelector('input') as HTMLInputElement;
  const clearButton = component.shadowRoot?.querySelector(
    '.clear'
  ) as HTMLElement;
  userEvent.clear(input);
  await new Promise((r) => setTimeout(r, 1000));
  await userEvent.type(input, 'Value', { delay: 100 });
  expect(input.value).toBe('Value');
  await new Promise((r) => setTimeout(r, 1000));
  userEvent.click(clearButton);
  expect(input.value).toBe('');
  await new Promise((r) => setTimeout(r, 1000));
  await new Promise(() => input.blur());
};
