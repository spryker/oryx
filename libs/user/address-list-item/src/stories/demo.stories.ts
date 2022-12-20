import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { AddressListItemAttributes } from '../address-list-item.model';
import { renderSelector } from './helper';

export default {
  title: `${storybookPrefix}/Address List Item`,
  args: {
    defaultBilling: false,
    defaultShipping: false,
    selectable: false,
    editable: true,
    removable: true,
  },
} as Meta;

interface Props extends AddressListItemAttributes {
  defaultBilling: boolean;
  defaultShipping: boolean;
}

const Template: Story<Props> = (props): TemplateResult => {
  return html`${renderSelector(props)}`;
};

export const Demo = Template.bind({});
