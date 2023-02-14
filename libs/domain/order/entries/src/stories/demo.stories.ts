import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { OrderEntriesOptions } from '../entries.model';

export default {
  title: `${storybookPrefix}/Entries`,
  argTypes: {
    limit: { control: { type: 'number' } },
    threshold: { control: { type: 'number' } },
  },
} as unknown as Meta;

const Template: Story<OrderEntriesOptions> = (
  options: OrderEntriesOptions
): TemplateResult => {
  return html`<oryx-order-entries .options=${options}></oryx-order-entries>`;
};

export const Demo = Template.bind({});

Demo.args = {
  threshold: 3,
  limit: 5,
};
