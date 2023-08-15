import {
  OverlaysDecorator,
  storybookDefaultViewports,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/User Profile`,
  decorators: [OverlaysDecorator(320, 568)],
  parameters: {
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<oryx-picking-user-profile></oryx-picking-user-profile>`;
};

export const Demo = Template.bind({});
