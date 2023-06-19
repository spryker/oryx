import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { OrderEntriesAttributes, OrderEntriesOptions } from '../entries.model';

export default {
  title: `${storybookPrefix}/Entries`,
  args: {
    expanded: false,
    threshold: 3,
    limit: 5,
  },
  argTypes: {
    limit: { control: { type: 'number' } },
    threshold: { control: { type: 'number' } },
  },
  parameters: { chromatic: { disableSnapshot: true } },
};

const Template: Story<OrderEntriesOptions & OrderEntriesAttributes> = ({
  expanded,
  ...options
}): TemplateResult => {
  return html`<oryx-order-entries
    ?expanded=${expanded}
    .options=${options}
  ></oryx-order-entries>`;
};

export const Demo = Template.bind({});
