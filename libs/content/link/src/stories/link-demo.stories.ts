import { useComponent } from '@spryker-oryx/core/utilities';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { SemanticLinkType, SEMANTIC_LINK_PROVIDERS } from '@spryker-oryx/site';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { contentLinkComponent } from '../component';
import { LinkOptions, LinkType } from '../link.model';

useComponent(contentLinkComponent);

export default {
  title: `${storybookPrefix}/Link`,
  loaders: [setUpMockProviders(SEMANTIC_LINK_PROVIDERS)],
} as unknown as Meta;

const Template: Story<LinkOptions> = (options): TemplateResult => {
  return html`<content-link .options="${options}"></content-link>`;
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
