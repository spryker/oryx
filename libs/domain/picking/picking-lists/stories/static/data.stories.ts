import { PickingListService } from '@spryker-oryx/picking';
import { MockPickingListService } from '@spryker-oryx/picking/mocks';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default { title: `${storybookPrefix}/Picking lists/Static` } as Meta;

const Template: Story = (): TemplateResult => {
  resolve<MockPickingListService>(PickingListService).setEmptyList(false);
  return html` <oryx-picking-lists></oryx-picking-lists> `;
};

export const Data = Template.bind({});
