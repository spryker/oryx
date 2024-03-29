import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { ContentLinkContent, ContentLinkOptions } from '../link.model';
import { RouteType } from '@spryker-oryx/router';

export default {
  title: `${storybookPrefix}/Link`,
  args: {
    url: '?path=/story/content-link--link-demo',
    text: 'Link',
    label: 'link',
    icon: undefined,
    noopener: false,
    nofollow: false,
    button: false,
  },
  argTypes: {
    icon: {
      options: getAppIcons(),
      control: { type: 'select' },
    },
    type: {
      options: [RouteType.Page, RouteType.Category, RouteType.Product],
      control: { type: 'select' },
    },
    noopener: {
      options: [true, false],
      control: { type: 'select' },
    },
    nofollow: {
      options: [true, false],
      control: { type: 'select' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as unknown as Meta;

const Template: Story<ContentLinkOptions & ContentLinkContent> = (
  options
): TemplateResult => {
  return html`<oryx-content-link
    .options=${options}
    .content=${options}
  ></oryx-content-link>`;
};

export const LinkDemo = Template.bind({});
