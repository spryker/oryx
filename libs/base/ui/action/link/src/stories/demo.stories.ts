import { getAppIcons } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { LinkComponentAttributes, LinkType } from '../link.model';

export default {
  title: `${storybookPrefix}/Actions/Link`,
  args: {
    linkType: LinkType.Link,
    disabled: false,
    multiLine: false,
    icon: undefined,
    link: '/?path=/story/ui-actions-link--link-demo',
    text: 'Link',
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
  },
} as Meta;

interface Props {
  link: string;
  text: string;
}

const Template: Story<LinkComponentAttributes & Props> = ({
  disabled,
  icon,
  link,
  linkType,
  multiLine,
  text,
}): TemplateResult => {
  return html`
    <oryx-link
      ?disabled=${disabled}
      ?multiLine=${multiLine}
      .linkType=${linkType}
      .icon=${icon}
    >
      <a href=${link}>${text}</a>
    </oryx-link>
  `;
};

export const LinkDemo = Template.bind({});
