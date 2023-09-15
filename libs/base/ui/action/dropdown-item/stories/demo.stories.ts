import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import {
  DropdownItemContent,
  DropdownItemOptions,
} from '../dropdown-item.model';

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
} as Meta;

const Template: Story<DropdownItemOptions & DropdownItemContent> = (
  options
): TemplateResult => {
  return html`<oryx-dropdown-item
    .options=${options}
    .content=${options}
  ></oryx-dropdown-item>`;
};

export const DropdownItemDemo = Template.bind({});
