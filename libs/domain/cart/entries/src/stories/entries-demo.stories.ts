import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { CartEntriesOptions } from '../entries.model';

export default {
  title: `${storybookPrefix}/Entries`,
} as Meta;

const Template: Story<CartEntriesOptions> = (): TemplateResult => {
  return html`<oryx-cart-entries
    .options=${{ cartId: 'multiple' }}
  ></oryx-cart-entries>`;
};

export const Demo = Template.bind({});
