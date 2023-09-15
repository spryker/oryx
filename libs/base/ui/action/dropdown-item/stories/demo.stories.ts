import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { DropdownItemComponentAttributes } from '../dropdown-item.model';

const icons = getAppIcons();

export default {
  title: `${storybookPrefix}/Actions/Dropdown Item`,
  args: {
    url: '',
    icon: 'person',
    text: 'Item',
  },
  argTypes: {
    icon: {
      options: ['', ...icons],
      control: { type: 'select' },
    },
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story<DropdownItemComponentAttributes> = (
  options
): TemplateResult => {
  const { icon, url, text } = options;
  return html`<oryx-dropdown-item
    .text=${text}
    .url=${url}
    .icon=${icon}
  ></oryx-dropdown-item>`;
};

export const DropdownItemDemo = Template.bind({});
