import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import {
  AddressDefaults,
  AddressListItemOptions,
} from '../address-list-item.model';
import { renderSelector } from './helper';

export default {
  title: `${storybookPrefix}/Address List Item`,
  args: {
    addressDefaults: AddressDefaults.All,
    selectable: false,
    editable: true,
    removable: true,
  },
  argTypes: {
    addressDefaults: {
      control: { type: 'select' },
      options: Object.values(AddressDefaults),
    },
  },
} as Meta;

const Template: Story<AddressListItemOptions> = (props): TemplateResult => {
  return html`${renderSelector(props)}`;
};

export const Demo = Template.bind({});
