import { mockPickingListData } from '@spryker-oryx/picking/mocks';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

const pickingListIds = mockPickingListData.map(({ id }) => id);

export default {
  title: `${storybookPrefix}/Order Reference`,
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

const Template: Story<{pickingListId: string}> = ({
  pickingListId,
}): TemplateResult => {
  return html`<oryx-picking-order-reference
    pickingListId=${pickingListId}
  ></oryx-picking-order-reference>`;
};

export const Demo = Template.bind({});
