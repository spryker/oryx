import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit';
import { TemplateResult } from 'lit/development';
import { storybookPrefix } from '../../../../.constants';
import { mockPickingListData } from '../../../mocks';
import { PickingListItemProps } from '../picking-list-item.model';

const pickingListIds = mockPickingListData.map(({ id }) => id);

export default {
  title: `${storybookPrefix}/Picking list item`,
  args: {
    pickingListId: pickingListIds[0],
  },
  argTypes: {
    pickingListId: {
      options: pickingListIds,
      control: { type: 'select' },
    },
  },
} as Meta;

const Template: Story<PickingListItemProps> = ({
  pickingListId,
}): TemplateResult => {
  return html`
    <oryx-picking-list-item
      pickingListId=${pickingListId}
    ></oryx-picking-list-item>
  `;
};

export const Demo = Template.bind({});

Demo.parameters = {
  chromatic: {
    disableSnapshot: true,
  },
};
