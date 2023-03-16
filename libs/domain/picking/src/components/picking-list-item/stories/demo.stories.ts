import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit';
import { TemplateResult } from 'lit/development';
import { storybookPrefix } from '../../../../.constants';
import { mockPickingListData } from '../../../mocks';

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

interface Props {
  pickingListId: string;
}

const Template: Story<Props> = ({ pickingListId }): TemplateResult => {
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
