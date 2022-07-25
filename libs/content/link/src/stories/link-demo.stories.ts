import { SemanticLinkType, setupSemanticLinkMocks } from '@spryker-oryx/site';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import '../index';
import { LinkOptions, LinkType } from '../link.model';

export default {
  title: `${storybookPrefix}/Link`,
  loaders: [setupSemanticLinkMocks as any],
} as Meta;

const Template: Story<LinkOptions> = (options): TemplateResult => {
  return html` <content-link .options="${options}"></content-link> `;
};

export const LinkDemo = Template.bind({});

LinkDemo.args = {
  type: LinkType.RawUrl,
  id: '?path=/story/content-link--link-demo',
  text: 'Link',
  label: 'link',
  icon: undefined,
  noopener: false,
  nofollow: false,
};

LinkDemo.argTypes = {
  icon: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
  },
  type: {
    options: [
      LinkType.RawUrl,
      SemanticLinkType.Page,
      SemanticLinkType.Category,
      SemanticLinkType.Product,
    ],
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
};
