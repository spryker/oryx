import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import '../index';
import { LinkOptions } from '../link.model';

export default {
  title: `${storybookPrefix}/Link`,
} as Meta;

const Template: Story<LinkOptions> = (props): TemplateResult => {
  const options = {
    target: props.target,
    noopener: !!props.noopener,
    nofollow: !!props.nofollow,
    text: props.text,
    href: props.id,
    icon: props.icon,
  };
  return html` <content-link .options=${options}></content-link> `;
};

export const ContentLinkDemo = Template.bind({});

ContentLinkDemo.args = {
  text: 'Furniture - Upgrade Your Office',
  id: '/furniture',
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
  id: {
    control: { type: 'text' },
  },
  icon: {
    control: { type: 'text' },
  },
};
