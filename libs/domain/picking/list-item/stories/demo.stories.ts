import { mockPickingListData } from '@spryker-oryx/picking/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit';
import { TemplateResult } from 'lit/development';
import { storybookPrefix } from '../../.constants';
import { ListItemAttributes } from '../list-item.model';

const pickingListIds = mockPickingListData.map(({ id }) => id);

export default {
  title: `${storybookPrefix}/List item`,
  args: {
    pickingListId: pickingListIds[0],
  },
  argTypes: {
    pickingListId: {
      options: pickingListIds,
      control: { type: 'select' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<ListItemAttributes> = ({
  pickingListId,
}): TemplateResult => {
  return html`
    <oryx-picking-list-item
      pickingListId=${pickingListId}
    ></oryx-picking-list-item>
  `;
};

export const Demo = Template.bind({});
