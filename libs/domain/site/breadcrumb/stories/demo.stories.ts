import { getAppIcons } from '@/tools/storybook';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { SiteBreadcrumbOptions } from '../breadcrumb.model';

export default {
  title: `${storybookPrefix}/Breadcrumb`,
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

const Template: Story<SiteBreadcrumbOptions> = (options): TemplateResult => {
  return html`<oryx-site-breadcrumb
    .options=${options}
  ></oryx-site-breadcrumb>`;
};

export const Demo = Template.bind({});
