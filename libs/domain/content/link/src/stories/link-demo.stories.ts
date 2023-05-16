import { SemanticLinkType } from '@spryker-oryx/site';
import { getResourceIcons } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ContentLinkOptions, ContentLinkType } from '../link.model';

export default {
  title: `${storybookPrefix}/Link`,
} as unknown as Meta;

const Template: Story<ContentLinkOptions> = (options): TemplateResult => {
  return html`<oryx-content-link .options="${options}"></oryx-content-link>`;
};

const icons = getResourceIcons();

export const LinkDemo = Template.bind({});

LinkDemo.args = {
  type: ContentLinkType.RawUrl,
  id: '?path=/story/content-link--link-demo',
  text: 'Link',
  label: 'link',
  icon: undefined,
  noopener: false,
  nofollow: false,
  button: false,
};

LinkDemo.argTypes = {
  icon: {
    options: icons,
    control: { type: 'select' },
  },
  type: {
    options: [
      ContentLinkType.RawUrl,
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
