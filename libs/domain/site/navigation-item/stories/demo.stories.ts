import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { SiteNavigationItemOptions } from '../navigation-item.model';

const icons = getAppIcons();

export default {
  title: `${storybookPrefix}/Navigation Item`,
  args: {
    url: '',
    icon: 'add',
    label: 'label',
    badge: '',
    triggerType: 'storefront-button',
    triggerBehavior: 'click',
    contentBehavior: 'navigation',
  },
  argTypes: {
    icon: {
      options: ['', ...icons],
      control: { type: 'select' },
    },
    triggerType: {
      options: ['button', 'icon', 'storefront-button'],
      control: { type: 'select' },
    },
    triggerBehavior: {
      options: ['click', 'hover'],
      control: { type: 'select' },
    },
    contentBehavior: {
      options: ['modal', 'dropdown', 'navigation'],
      control: { type: 'select' },
    },
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story<SiteNavigationItemOptions> = (
  options
): TemplateResult => {
  return html` <oryx-site-navigation-item
    .options=${options}
  ></oryx-site-navigation-item>`;
};

export const Demo = Template.bind({});
