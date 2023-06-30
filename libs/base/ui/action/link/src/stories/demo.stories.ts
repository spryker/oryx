import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { LinkComponentAttributes, LinkType } from '../link.model';

export default {
  title: `${storybookPrefix}/Actions/Link`,
  args: {
    linkType: LinkType.Link,
    disabled: false,
    singleLine: false,
    icon: undefined,
    link: '/?path=/story/ui-actions-link--link-demo',
    text: 'Link',
    color: 'primary',
  },
  argTypes: {
    linkType: {
      options: [LinkType.Link, LinkType.ExternalLink],
      control: { type: 'select' },
    },
    icon: {
      options: getAppIcons(),
      control: { type: 'select' },
    },
    text: {
      control: { type: 'text' },
      table: { category: 'demo' },
    },
    link: {
      control: { type: 'text' },
      table: { category: 'demo' },
    },
    color: {
      control: { type: 'select', options: ['primary', 'neutral', 'light'] },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

interface Props {
  link: string;
  text: string;
}

const Template: Story<LinkComponentAttributes & Props> = (
  props
): TemplateResult => {
  return html`
    <oryx-link
      ?disabled=${props.disabled}
      ?singleLine=${props.singleLine}
      .linkType=${props.linkType}
      .icon=${props.icon}
      .color=${props.color}
    >
      <a href=${props.link}>${props.text}</a>
    </oryx-link>
  `;
};

export const LinkDemo = Template.bind({});
