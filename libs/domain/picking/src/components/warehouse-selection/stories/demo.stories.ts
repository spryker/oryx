import { storybookDefaultViewports } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit';
import { TemplateResult } from 'lit/development';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Warehouse selection`,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <oryx-warehouse-selection></oryx-warehouse-selection> `;
};

export const Demo = Template.bind({});
