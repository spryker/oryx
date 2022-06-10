import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import '../index';
import { LinkContent } from '../link.model';

export default {
  title: `${storybookPrefix}/Link`,
} as Meta;

const Template: Story<LinkContent> = (content: LinkContent): TemplateResult => {
  return html` <content-link .content=${content}></content-link> `;
};

export const ContentLinkDemo = Template.bind({});

ContentLinkDemo.args = {
  text: 'Furniture - Upgrade Your Office',
  href: '/furniture',
};

ContentLinkDemo.argTypes = {
  text: {
    control: { type: 'text' },
  },
  href: {
    control: { type: 'text' },
  },
  target: {
    control: { type: 'text' },
  },
  icon: {
    control: { type: 'text' },
  },
  noopener: {
    control: { type: 'boolean' },
  },
  nofollow: {
    control: { type: 'boolean' },
  },
};
