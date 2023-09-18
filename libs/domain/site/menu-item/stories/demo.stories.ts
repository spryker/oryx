import { getAppIcons } from '@/tools/storybook';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { SiteMenuItemOptions } from '../menu-item.model';

export default {
  title: `${storybookPrefix}/Menu Item`,
  args: {
    text: 'item',
    icon: IconTypes.Description,
    url: '/route',
  },
  argTypes: {
    icon: {
      options: getAppIcons(),
      control: { type: 'select' },
    },
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story<SiteMenuItemOptions> = (options): TemplateResult => {
  return html`<oryx-site-menu-item
    .options=${options}
    .content=${options}
  ></oryx-site-menu-item>`;
};

export const MenuItemDemo = Template.bind({});
