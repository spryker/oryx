import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { CartEntriesOptions } from '../entries.model';

export default {
  title: `${storybookPrefix}/Entries`,
  args: {
    readonly: false,
  },
} as Meta;

const Template: Story<CartEntriesOptions> = (
  options: CartEntriesOptions
): TemplateResult => {
  return html`<cart-entries
    .options=${{ ...options, cartId: 'multiple' }}
  ></cart-entries>`;
};

export const Demo = Template.bind({});

Demo.parameters = {
  chromatic: { disableSnapshot: true },
};
