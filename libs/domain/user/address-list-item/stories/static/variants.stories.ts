import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { AddressDefaults } from '../../address-list-item.model';
import { renderSelector } from '../helper';

export default {
  title: `${storybookPrefix}/Address List Item/Static`,
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h4>Selectable</h4>
    ${renderSelector({ selectable: true })}

    <h4>With controls</h4>
    ${renderSelector({ editable: true, removable: true })}

    <h4>With defaults</h4>
    ${renderSelector({ addressDefaults: AddressDefaults.All })}

    <h4>Default billing</h4>
    ${renderSelector({ addressDefaults: AddressDefaults.Billing })}

    <h4>Default shipping</h4>
    ${renderSelector({ addressDefaults: AddressDefaults.Shipping })}
  `;
};

export const Variants = Template.bind({});
