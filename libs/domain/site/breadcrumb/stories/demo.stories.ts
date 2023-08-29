import { getAppIcons } from '@/tools/storybook';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { SiteBreadcrumbOptions } from '../breadcrumb.model';

const icons = getAppIcons()

export default {
  title: `${storybookPrefix}/Breadcrumb`,
  args: {
    divider: IconTypes.Forward,
  },
  argTypes: {
    divider: {
      options: [ '', ...icons],
      control: { 
        type: 'select',
      },
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
