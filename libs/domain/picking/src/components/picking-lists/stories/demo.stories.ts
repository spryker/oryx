import { storybookDefaultViewports } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit';
import { TemplateResult } from 'lit/development';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Picking lists`,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <oryx-picking-lists></oryx-picking-lists> `;
};

export const Demo = Template.bind({});
