import {
  MockDateDecorator,
  storybookDefaultViewports,
} from '@/tools/storybook';
import { resolve } from '@spryker-oryx/di';
import { MockPickingListService } from '@spryker-oryx/picking/mocks';
import { PickingListService } from '@spryker-oryx/picking/services';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Lists/Static`,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
  decorators: [MockDateDecorator()],
} as Meta;

const Template: Story = (): TemplateResult => {
  resolve<MockPickingListService>(PickingListService).setEmptyList(true);
  return html` <oryx-picking-lists></oryx-picking-lists> `;
};

export const Empty = Template.bind({});
