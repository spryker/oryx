import { storybookDefaultViewports } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit';
import { TemplateResult } from 'lit/development';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Warehouse assignment`,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-picking-warehouse-assignment></oryx-picking-warehouse-assignment>
  `;
};

export const Demo = Template.bind({});
