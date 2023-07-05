import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { CartEntriesOptions } from '../entries.model';

export default {
  title: `${storybookPrefix}/Entries`,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<CartEntriesOptions> = (): TemplateResult => {
  return html`<oryx-cart-entries cartId="multiple"></oryx-cart-entries>`;
};

export const Demo = Template.bind({});
