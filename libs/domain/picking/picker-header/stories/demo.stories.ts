import { ListItemAttributes } from '@spryker-oryx/picking/list-item';
import { mockPickingListData } from '@spryker-oryx/picking/mocks';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

const pickingListIds = mockPickingListData.map(({ id }) => id);

export default {
  title: `${storybookPrefix}/Picker header`,
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

const Template: Story<ListItemAttributes> = ({
  pickingListId,
}): TemplateResult => {
  return html`<oryx-picking-picker-header
    pickingListId=${pickingListId}
  ></oryx-picking-picker-header>`;
};

export const Demo = Template.bind({});
