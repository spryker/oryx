import { storybookPrefix } from '../../constant';
import '../index';
import { LinkTypes } from '../link.model';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';

export default {
  title: `${storybookPrefix}/Link`,
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

export const Basic = Template.bind({});

Basic.args = {
  linkType: LinkTypes.Link,
  disabled: false,
  link: '/?path=/story/ui-link--basic',
  text: 'Link',
  icon: undefined,
};

Basic.argTypes = {
  linkType: {
    options: [LinkTypes.Link, LinkTypes.ExternalLink],
    control: { type: 'select' },
  },
  icon: {
    control: { type: 'text' },
  },
};
