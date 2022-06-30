import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import '../index';
import { LinkContent, LinkOptions } from '../link.model';

export default {
  title: `${storybookPrefix}/Link`,
} as Meta;

const Template: Story<LinkOptions & LinkContent> = (props): TemplateResult => {
  const content = {
    text: props.text,
    href: props.href,
    icon: props.icon,
  };
  const options = {
    target: props.target,
    noopener: !!props.noopener,
    nofollow: !!props.nofollow,
  };
  return html`
    <content-link .content=${content} .options=${options}></content-link>
  `;
};

export const ContentLinkDemo = Template.bind({});

ContentLinkDemo.args = {
  text: 'Furniture - Upgrade Your Office',
  href: '/furniture',
};

ContentLinkDemo.argTypes = {
  target: {
    control: { type: 'text' },
  },
  noopener: {
    control: { type: 'boolean' },
  },
  nofollow: {
    control: { type: 'boolean' },
  },
  text: {
    control: { type: 'text' },
  },
  href: {
    control: { type: 'text' },
  },
  icon: {
    control: { type: 'text' },
  },
};
