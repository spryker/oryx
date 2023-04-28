import { MockDateDecorator, storybookDefaultViewports } from '@spryker-oryx/ui';
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
  decorators: [MockDateDecorator(new Date("March 20, 2020 20:00:00"))],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <oryx-picking-lists></oryx-picking-lists> `;
};

export const Demo = Template.bind({});
