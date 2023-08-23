import { getAppIcons } from '@/tools/storybook';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { SiteBreadcrumbsOptions } from '../breadcrumbs.model';

export default {
  title: `${storybookPrefix}/Breadcrumbs`,
  args: {
    dividerIcon: IconTypes.Front,
    showDivider: true,
  },
  argTypes: {
    dividerIcon: {
      options: getAppIcons(),
      control: { type: 'select' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<SiteBreadcrumbsOptions> = (options): TemplateResult => {
  return html`<oryx-site-breadcrumbs
    .options=${options}
  ></oryx-site-breadcrumbs>`;
};

export const Demo = Template.bind({});