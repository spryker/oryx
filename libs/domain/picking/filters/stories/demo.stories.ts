import {
  OverlaysDecorator,
  storybookDefaultViewports,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Filters`,
  //900px height is set to be sure that all content fit to the chromatic viewport
  //that has non-configurable 900px height by default
  decorators: [OverlaysDecorator(300, 900)],
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <oryx-picking-filters open></oryx-picking-filters> `;
};

export const Demo = Template.bind({});
