import { getAppIcons } from '@/tools/storybook';
import { RouteType } from '@spryker-oryx/router';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import {
  ContentLinkAppearance,
  ContentLinkContent,
  ContentLinkOptions,
} from '../link.model';

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
    appearance: ContentLinkAppearance.LINK,
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
    appearance: {
      options: [
        ContentLinkAppearance.LINK,
        ContentLinkAppearance.BUTTON,
        ContentLinkAppearance.DROPDOWN,
      ],
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
