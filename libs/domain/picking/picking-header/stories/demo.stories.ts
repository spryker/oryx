import { mockPickingListData } from '@spryker-oryx/picking/src/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { PickingListItemAttributes } from '../../picking-list-item/picking-list-item.model';

const pickingListIds = mockPickingListData.map(({ id }) => id);

export default {
  title: `${storybookPrefix}/Picking header`,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
  args: { pickingListId: pickingListIds[0] },
  argTypes: {
    pickingListId: {
      options: pickingListIds,
      control: { type: 'select' },
    },
  },
} as Meta;

const Template: Story<PickingListItemAttributes> = ({
  pickingListId,
}): TemplateResult => {
  return html`<oryx-picking-header
    pickingListId=${pickingListId}
  ></oryx-picking-header>`;
};

export const Demo = Template.bind({});
