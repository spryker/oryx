import { IconTypes } from '@spryker-oryx/themes/icons';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { LinkTypes } from '../link.model';

export default {
  title: `${storybookPrefix}/Actions/Link`,
} as Meta;

interface Props {
  disabled?: boolean;
  icon?: string;
  link: string;
  linkType: LinkTypes;
  text: string;
}

const Template: Story<Props> = ({
  disabled,
  icon,
  link,
  linkType,
  text,
}): TemplateResult => {
  return html`
    <oryx-link ?disabled=${disabled} .linkType=${linkType} .icon=${icon}>
      <a href=${link}>${text}</a>
    </oryx-link>
  `;
};

export const LinkDemo = Template.bind({});

LinkDemo.args = {
  linkType: LinkTypes.Link,
  disabled: false,
  link: '/?path=/story/ui-actions-link--link-demo',
  text: 'Link',
  icon: undefined,
};

LinkDemo.argTypes = {
  linkType: {
    options: [LinkTypes.Link, LinkTypes.ExternalLink],
    control: { type: 'select' },
  },
  icon: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
  },
};
