import { storybookDefaultViewports } from '@/tools/storybook';
import { resolve } from '@spryker-oryx/di';
import { PickingListService } from '@spryker-oryx/picking';
import { MockPickingListService } from '@spryker-oryx/picking/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Picking lists/Static`,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
} as Meta;

const Template: Story = (): TemplateResult => {
  resolve<MockPickingListService>(PickingListService).setEmptyList(true);
  return html` <oryx-picking-lists></oryx-picking-lists> `;
};

export const Empty = Template.bind({});
